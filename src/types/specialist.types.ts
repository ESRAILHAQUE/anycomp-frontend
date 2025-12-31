export enum SpecialistStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export interface Specialist {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  profile_image?: string;
  status: SpecialistStatus;
  additional_info?: Record<string, any>;
  service_offerings?: ServiceOffering[];
  media?: Media[];
  created_at: string;
  updated_at: string;
}

export interface ServiceOffering {
  id: string;
  service_name: string;
  description?: string;
  price?: number;
  currency?: string;
  specialist_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  file_name: string;
  file_path: string;
  file_type?: string;
  file_size?: number;
  mime_type?: string;
  specialist_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SpecialistsResponse {
  status: string;
  data: {
    specialists: Specialist[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface SpecialistResponse {
  status: string;
  data: {
    specialist: Specialist;
  };
}

