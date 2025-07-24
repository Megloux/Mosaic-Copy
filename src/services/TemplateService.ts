import { Template, TemplateStructure, TemplateBlock } from '@/features/routines/model/types';

/**
 * Service responsible for fetching and managing template data
 * Uses caching to minimize API calls and improve performance
 */
export class TemplateService {
  // In-memory cache for templates
  private cache: Map<string, Template> = new Map();
  
  /**
   * Fetch all available templates
   * @returns Promise resolving to array of templates
   */
  async getAllTemplates(): Promise<Template[]> {
    try {
      // In a real implementation, this would be an API call
      const response = await fetch('/api/templates');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status}`);
      }
      
      const templates = await response.json();
      
      // Cache templates for future use
      templates.forEach((template: Template) => {
        this.cache.set(template.id, template);
      });
      
      return templates;
    } catch (error) {
      console.error('Error fetching templates:', error);
      
      // Return fallback templates in case of error
      // This ensures the UI doesn't break if the API is down
      return this.getFallbackTemplates();
    }
  }
  
  /**
   * Fetch a specific template by ID
   * @param id Template ID
   * @returns Promise resolving to template
   */
  async getTemplateById(id: string): Promise<Template> {
    // Check cache first to minimize API calls
    if (this.cache.has(id)) {
      console.log('Template cache hit for ID:', id);
      return this.cache.get(id)!;
    }
    
    try {
      // In a real implementation, this would be an API call
      const response = await fetch(`/api/templates/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.status}`);
      }
      
      const template = await response.json();
      
      // Validate template before caching
      if (this.validateTemplate(template)) {
        // Cache template for future use
        this.cache.set(template.id, template);
        return template;
      } else {
        throw new Error('Invalid template structure');
      }
    } catch (error) {
      console.error(`Error fetching template ${id}:`, error);
      
      // Try to get a fallback template
      const fallbackTemplates = this.getFallbackTemplates();
      const fallbackTemplate = fallbackTemplates.find(t => t.id === id) || fallbackTemplates[0];
      
      return fallbackTemplate;
    }
  }
  
  /**
   * Validate a template has the correct structure
   * @param template Template to validate
   * @returns boolean indicating if template is valid
   */
  validateTemplate(template: Template): boolean {
    // Check required fields
    if (!template.id || !template.name || typeof template.isProOnly !== 'boolean') {
      console.error('Template missing required fields');
      return false;
    }
    
    // Validate structure
    if (!template.structure || !Array.isArray(template.structure.blocks)) {
      console.error('Template missing structure or blocks array');
      return false;
    }
    
    // Validate each block
    for (const block of template.structure.blocks) {
      if (!this.validateTemplateBlock(block)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Validate a template block has the correct structure
   * @param block Block to validate
   * @returns boolean indicating if block is valid
   */
  private validateTemplateBlock(block: TemplateBlock): boolean {
    // Check required fields
    if (!block.block_id || !block.name) {
      console.error('Block missing required fields', block);
      return false;
    }
    
    // Check template tags
    if (!Array.isArray(block.template_tags)) {
      console.error('Block template_tags is not an array', block);
      return false;
    }
    
    // Check exercise count
    if (!block.exercise_count || 
        typeof block.exercise_count.min !== 'number' || 
        typeof block.exercise_count.max !== 'number') {
      console.error('Block has invalid exercise_count', block);
      return false;
    }
    
    // Check min/max relationship
    if (block.exercise_count.min > block.exercise_count.max) {
      console.error('Block min exercise count exceeds max', block);
      return false;
    }
    
    return true;
  }
  
  /**
   * Provide fallback templates in case API fails
   * @returns Array of basic template definitions
   */
  private getFallbackTemplates(): Template[] {
    // These templates will be used if the API is unavailable
    return [
      {
        id: 'fallback-1',
        name: 'Basic Workout',
        description: 'A simple full-body workout (fallback template)',
        isProOnly: false,
        structure: {
          blocks: [
            {
              block_id: 'warmup',
              name: 'Warm Up',
              template_tags: ['Warmup', 'Core'],
              exercise_count: {
                min: 2,
                max: 3
              },
              instructions: 'Start with these exercises to warm up',
              is_warmup: true,
              has_cardio_burst: false
            },
            {
              block_id: 'main',
              name: 'Main Workout',
              template_tags: ['Strength', 'FullBody'],
              exercise_count: {
                min: 3,
                max: 5
              },
              instructions: 'Complete these exercises for your main workout',
              is_warmup: false,
              has_cardio_burst: false
            },
            {
              block_id: 'cooldown',
              name: 'Cool Down',
              template_tags: ['Cooldown', 'Stretching'],
              exercise_count: {
                min: 2,
                max: 3
              },
              instructions: 'Finish with these exercises to cool down',
              is_warmup: false,
              has_cardio_burst: false
            }
          ],
          estimatedDuration: 30,
          difficulty: 'beginner',
          focus: ['FullBody']
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
}

// Export a singleton instance for use throughout the app
export const templateService = new TemplateService();
