export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under-review',
}

export interface Specialist {
  id: string;
  average_rating?: number;
  is_draft: boolean;
  total_number_of_ratings?: number;
  title: string;
  slug: string;
  description?: string;
  base_price: number;
  platform_fee?: number;
  final_price: number;
  verification_status: VerificationStatus;
  is_verified: boolean;
  duration_days: number;
  service_offerings?: ServiceOffering[];
  media?: Media[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ServiceOffering {
  id: string;
  specialists: string;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  specialists: string;
  file_name: string;
  file_size: number;
  display_order: number;
  mime_type?: string;
  media_type: string;
  uploaded_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
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
