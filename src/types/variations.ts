/**
 * Types for exercise variations in the Mosaic application
 */

/**
 * Represents a single variation that can be applied to exercises
 */
export interface Variation {
  id: string;
  variation_name: string;
  category_id: string;
  setup_instructions: string;
  movement_notes: string;
  cueing: string;
  this_that: string;
  spring_setup: {
    light_springs: number;
    heavy_springs: number;
  };
  template_tags: string[];
  vimeo_id: string;
  standard_time: string;
}

/**
 * Filters that can be applied when searching for variations
 */
export interface VariationFilters {
  categoryIds?: string[];
  tags?: string[];
  search?: string;
}

/**
 * A variation with a score for recommendation purposes
 */
export interface ScoredVariation extends Variation {
  score: number;
}

/**
 * Response format for variation API calls
 */
export interface VariationResponse {
  variations: Variation[];
  categories: VariationCategory[];
}

/**
 * Represents a category of variations
 */
export interface VariationCategory {
  id: string;
  name: string;
  description: string;
}
