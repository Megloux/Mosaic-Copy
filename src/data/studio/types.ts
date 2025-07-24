import { StudioId, ContentId } from '../../types/ids';

export interface Studio {
    id: StudioId;
    name: string;
    settings?: Record<string, unknown>;
}

export interface StudioCustomization {
    studio_id: StudioId;
    content_type: 'exercise' | 'template';
    content_id: ContentId;
    custom_name?: string;
    vimeo_id?: string;
    custom_data?: Record<string, unknown>;
}
