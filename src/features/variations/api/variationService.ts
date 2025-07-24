import { Variation, VariationFilters, ScoredVariation, VariationResponse, VariationCategory } from '@/features/variations/model/types';
import { TemplateBlock } from '@/features/routines/model/types';
import * as variationsApi from '../api/variations/variations';

/**
 * Service responsible for fetching variations and implementing recommendation algorithms
 * This service connects to the Variation Library and provides recommendations based on template tags
 */
export class VariationService {
  // In-memory cache for variations
  private variationCache: Map<string, Variation> = new Map();
  // Cache for category-based queries to reduce API calls
  private categoryQueryCache: Map<string, Variation[]> = new Map();
  // Cache for tag-based queries
  private tagQueryCache: Map<string, Variation[]> = new Map();
  // Cache for variation categories
  private categoriesCache: VariationCategory[] = [];
  
  /**
   * Fetch all variations from the API
   * @returns Promise resolving to array of variations
   */
  async getAllVariations(): Promise<Variation[]> {
    try {
      const { variations, categories, error } = await variationsApi.getAllVariations();
      
      if (error) {
        throw new Error(`Failed to fetch variations: ${error.message}`);
      }
      
      // Cache variations for future use
      variations.forEach(variation => {
        this.variationCache.set(variation.id, variation);
      });

      // Cache categories if they're included in the response
      if (categories && categories.length > 0) {
        this.categoriesCache = categories;
      }
      
      return variations;
    } catch (error) {
      console.error('Error fetching variations:', error);
      return [];
    }
  }
  
  /**
   * Fetch all variation categories
   * @returns Promise resolving to array of variation categories
   */
  async getAllCategories(): Promise<VariationCategory[]> {
    // Return cached categories if available
    if (this.categoriesCache.length > 0) {
      return this.categoriesCache;
    }
    
    try {
      const { data, error } = await variationsApi.getAllCategories();
      
      if (error) {
        throw new Error(`Failed to fetch variation categories: ${error.message}`);
      }
      
      this.categoriesCache = data;
      
      return data;
    } catch (error) {
      console.error('Error fetching variation categories:', error);
      return [];
    }
  }
  
  /**
   * Fetch variations that match specific tags
   * @param tags Array of tags to match
   * @returns Promise resolving to array of matching variations
   */
  async getVariationsByTags(tags: string[]): Promise<Variation[]> {
    // Create a cache key from the sorted tags
    const cacheKey = tags.sort().join(',');
    
    // Check cache first
    if (this.tagQueryCache.has(cacheKey)) {
      return this.tagQueryCache.get(cacheKey)!;
    }
    
    try {
      const { data, error } = await variationsApi.getVariationsByTags(tags);
      
      if (error) {
        throw new Error(`Failed to fetch variations by tags: ${error.message}`);
      }
      
      // Cache the result
      this.tagQueryCache.set(cacheKey, data);
      
      // Also update the individual variation cache
      data.forEach(variation => {
        this.variationCache.set(variation.id, variation);
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching variations by tags:', error);
      return [];
    }
  }
  
  /**
   * Fetch variations by category
   * @param categoryId Category ID to filter by
   * @returns Promise resolving to array of variations in the category
   */
  async getVariationsByCategory(categoryId: string): Promise<Variation[]> {
    // Check cache first
    if (this.categoryQueryCache.has(categoryId)) {
      return this.categoryQueryCache.get(categoryId)!;
    }
    
    try {
      const { data, error } = await variationsApi.getVariationsByCategory(categoryId);
      
      if (error) {
        throw new Error(`Failed to fetch variations by category: ${error.message}`);
      }
      
      // Cache the result
      this.categoryQueryCache.set(categoryId, data);
      
      // Also update the individual variation cache
      data.forEach(variation => {
        this.variationCache.set(variation.id, variation);
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching variations by category:', error);
      return [];
    }
  }
  
  /**
   * Get a specific variation by ID
   * @param id Variation ID
   * @returns Promise resolving to the variation or null if not found
   */
  async getVariationById(id: string): Promise<Variation | null> {
    // Check cache first
    if (this.variationCache.has(id)) {
      return this.variationCache.get(id)!;
    }
    
    try {
      const { data, error } = await variationsApi.getVariationById(id);
      
      if (error) {
        if (error.code === 'PGRST116') { // Not found
          return null;
        }
        throw new Error(`Failed to fetch variation: ${error.message}`);
      }
      
      if (!data) {
        return null;
      }
      
      // Cache the result
      this.variationCache.set(id, data);
      
      return data;
    } catch (error) {
      console.error(`Error fetching variation with ID ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Search for variations based on filters
   * @param filters Filters to apply
   * @returns Promise resolving to filtered variations
   */
  async searchVariations(filters: VariationFilters): Promise<Variation[]> {
    try {
      const { data, error } = await variationsApi.searchVariations({
        categoryIds: filters.categoryIds,
        tags: filters.tags,
        search: filters.search
      });
      
      if (error) {
        throw new Error(`Failed to search variations: ${error.message}`);
      }
      
      // Update the cache
      data.forEach(variation => {
        this.variationCache.set(variation.id, variation);
      });
      
      return data;
    } catch (error) {
      console.error('Error searching variations:', error);
      return [];
    }
  }
  
  /**
   * Recommend variations for a template block based on its tags
   * @param block Template block to recommend variations for
   * @param count Number of variations to recommend
   * @returns Promise resolving to scored variations sorted by relevance
   */
  async recommendVariationsForBlock(block: TemplateBlock, count: number = 3): Promise<ScoredVariation[]> {
    if (!block.template_tags || block.template_tags.length === 0) {
      return [];
    }
    
    try {
      // Get variations that match any of the block's tags
      const variations = await this.getVariationsByTags(block.template_tags);
      
      // Score each variation based on tag matches
      const scoredVariations: ScoredVariation[] = variations.map(variation => {
        let score = 0;
        
        // Base score: +1 for each matching tag
        block.template_tags.forEach(blockTag => {
          if (variation.template_tags.includes(blockTag)) {
            score += 1;
          }
        });
        
        // Bonus: +2 if the variation has all block tags
        const hasAllBlockTags = block.template_tags.every(blockTag => 
          variation.template_tags.includes(blockTag)
        );
        if (hasAllBlockTags) {
          score += 2;
        }
        
        return {
          ...variation,
          score
        };
      });
      
      // Sort by score (highest first) and take the requested count
      return scoredVariations
        .sort((a, b) => b.score - a.score)
        .slice(0, count);
    } catch (error) {
      console.error('Error recommending variations:', error);
      return [];
    }
  }
  
  /**
   * Save a variation to the database
   * @param variation Variation to save
   * @returns Promise resolving to the saved variation
   */
  async saveVariation(variation: Variation): Promise<Variation | null> {
    try {
      const { data, error } = await variationsApi.saveVariation(variation);
      
      if (error) {
        throw new Error(`Failed to save variation: ${error.message}`);
      }
      
      if (!data) {
        return null;
      }
      
      // Update the cache
      this.variationCache.set(data.id, data);
      
      // Clear query caches since data has changed
      this.categoryQueryCache.clear();
      this.tagQueryCache.clear();
      
      return data;
    } catch (error) {
      console.error('Error saving variation:', error);
      return null;
    }
  }
  
  /**
   * Delete a variation from the database
   * @param id Variation ID to delete
   * @returns Promise resolving to success status
   */
  async deleteVariation(id: string): Promise<boolean> {
    try {
      const { success, error } = await variationsApi.deleteVariation(id);
      
      if (error) {
        throw new Error(`Failed to delete variation: ${error.message}`);
      }
      
      // Remove from cache
      this.variationCache.delete(id);
      
      // Clear query caches since data has changed
      this.categoryQueryCache.clear();
      this.tagQueryCache.clear();
      
      return success;
    } catch (error) {
      console.error(`Error deleting variation with ID ${id}:`, error);
      return false;
    }
  }
  
  /**
   * Clear all caches
   */
  clearCache(): void {
    this.variationCache.clear();
    this.categoryQueryCache.clear();
    this.tagQueryCache.clear();
    this.categoriesCache = [];
  }
}

// Export a singleton instance for use throughout the app
export const variationService = new VariationService();
