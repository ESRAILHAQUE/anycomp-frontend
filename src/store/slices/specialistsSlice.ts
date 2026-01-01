import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { specialistApi } from '@/services/api';
import {
  Specialist,
  SpecialistsResponse,
} from '@/types/specialist.types';

interface SpecialistsState {
  specialists: Specialist[];
  currentSpecialist: Specialist | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status: 'all' | 'draft' | 'published';
    search: string;
  };
}

const initialState: SpecialistsState = {
  specialists: [],
  currentSpecialist: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    status: 'all',
    search: '',
  },
};

// Async thunks
export const fetchSpecialists = createAsyncThunk(
  'specialists/fetchSpecialists',
  async (params?: {
    page?: number;
    limit?: number;
    status?: 'all' | 'draft' | 'published';
    search?: string;
  }) => {
    const response = await specialistApi.getSpecialists(params);
    return response.data;
  }
);

export const fetchSpecialistById = createAsyncThunk(
  'specialists/fetchSpecialistById',
  async (id: string) => {
    const response = await specialistApi.getSpecialistById(id);
    return response.data.specialist;
  }
);

export const createSpecialist = createAsyncThunk(
  'specialists/createSpecialist',
  async (data: Partial<Specialist>) => {
    const response = await specialistApi.createSpecialist(data);
    return response.data.specialist;
  }
);

export const updateSpecialist = createAsyncThunk(
  'specialists/updateSpecialist',
  async ({ id, data }: { id: string; data: Partial<Specialist> }) => {
    const response = await specialistApi.updateSpecialist(id, data);
    return response.data.specialist;
  }
);

export const deleteSpecialist = createAsyncThunk(
  'specialists/deleteSpecialist',
  async (id: string) => {
    await specialistApi.deleteSpecialist(id);
    return id;
  }
);

export const togglePublishStatus = createAsyncThunk(
  'specialists/togglePublishStatus',
  async ({ id, is_draft }: { id: string; is_draft?: boolean }) => {
    const response = await specialistApi.togglePublishStatus(id, is_draft);
    return response.data.specialist;
  }
);

const specialistsSlice = createSlice({
  name: 'specialists',
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<{
        status?: 'all' | 'draft' | 'published';
        search?: string;
      }>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearCurrentSpecialist: (state) => {
      state.currentSpecialist = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch specialists
    builder
      .addCase(fetchSpecialists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialists.fulfilled, (state, action) => {
        state.loading = false;
        state.specialists = action.payload.specialists;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSpecialists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch specialists';
      });

    // Fetch specialist by ID
    builder
      .addCase(fetchSpecialistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialistById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSpecialist = action.payload;
      })
      .addCase(fetchSpecialistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch specialist';
      });

    // Create specialist
    builder
      .addCase(createSpecialist.fulfilled, (state, action) => {
        state.specialists.unshift(action.payload);
      })
      .addCase(createSpecialist.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create specialist';
      });

    // Update specialist
    builder
      .addCase(updateSpecialist.fulfilled, (state, action) => {
        const index = state.specialists.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.specialists[index] = action.payload;
        }
        if (state.currentSpecialist?.id === action.payload.id) {
          state.currentSpecialist = action.payload;
        }
      })
      .addCase(updateSpecialist.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update specialist';
      });

    // Delete specialist
    builder
      .addCase(deleteSpecialist.fulfilled, (state, action) => {
        state.specialists = state.specialists.filter(
          (s) => s.id !== action.payload
        );
      })
      .addCase(deleteSpecialist.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete specialist';
      });

    // Toggle publish status
    builder
      .addCase(togglePublishStatus.fulfilled, (state, action) => {
        const index = state.specialists.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.specialists[index] = action.payload;
        }
      })
      .addCase(togglePublishStatus.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update status';
      });
  },
});

export const { setFilters, setPage, clearCurrentSpecialist } =
  specialistsSlice.actions;
export default specialistsSlice.reducer;
