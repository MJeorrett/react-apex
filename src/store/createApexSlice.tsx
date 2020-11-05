import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import Axios, { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function isAxiosError(error: AxiosError | any): error is AxiosError {
  return error && error.isAxiosError
}

function handleError(error: AxiosError, rejectWithValue: (value: ApiError) => any) {
  if (error.response) {
    return rejectWithValue({
      message: `Request failed with status code ${error.response.status}.`,
      errorDetail: error.toJSON(),
    });
  } else if (error.request) {
    return rejectWithValue({
      message: 'No response received.',
      errorDetail: error.toJSON(),
    });
  } else {
    return rejectWithValue({
      message: 'Error setting up request.',
      errorDetail: {
        message: error.message,
      },
    });
  }
}

interface CreateApexSliceOptions<T, TSummary, TId> {
  name: string;
  endpoint: string;
  selectSummaryId: (item: TSummary) => TId;
  selectSliceState: (state: any) => ApexSliceState<T, TSummary>,
}

interface ApexSliceState<T, TSummary> {
  entities: EntityState<TSummary>;
  entitiesMeta: {
    isLoading: boolean,
    apiError?: ApiError,
  };
  entity?: T,
  entityMeta: {
    isLoading: boolean,
    apiError?: ApiError,
  }
}

interface ApiError {
  message: string,
  errorDetail: object,
}

export function createApexSlice<T, TSummary, TId extends string | number>({
  name,
  endpoint,
  selectSummaryId: selectId,
  selectSliceState,
}: CreateApexSliceOptions<T, TSummary, TId>) {
  const getAllSummaries = createAsyncThunk<
    TSummary[],
    undefined,
    {
      rejectValue: ApiError,
    }
  >(
    `${name}/fetchAll`,
    async (_, { rejectWithValue }) => {
      try {
        const result = await Axios.get(endpoint);
        return result.data as TSummary[];
      }
      catch (error) {
        if (isAxiosError(error)) {
          return handleError(error, rejectWithValue);
        }
        throw error;
      }
    }
  );

  const getById = createAsyncThunk<
    T,
    TId,
    {
      rejectValue: ApiError,
    }
  >(
    `${name}/getById`,
    async (id, { rejectWithValue }) => {
      try {
        const result = await Axios.get(`${endpoint}/${id}`);
        return result.data as T;
      }
      catch (error) {
        if (isAxiosError(error)) {
          return handleError(error, rejectWithValue);
        }
        throw error;
      }
    }
  );

  const entityAdapter = createEntityAdapter<TSummary>({
    selectId,
  });

  const initialState: ApexSliceState<T, TSummary> = {
    entities: entityAdapter.getInitialState(),
    entitiesMeta: {
      isLoading: false,
      apiError: undefined,
    },
    entity: undefined,
    entityMeta: {
      isLoading: false,
      apiError: undefined,
    },
  };

  const slice = createSlice({
    name,
    initialState,
    reducers: {
    },
    extraReducers: builder => {
      builder.addCase(getAllSummaries.pending, state => {
        state.entitiesMeta.isLoading = true;
        state.entitiesMeta.apiError = undefined;
      });
      builder.addCase(getAllSummaries.fulfilled, (state, { payload }) => {
        state.entitiesMeta.isLoading = false;
        entityAdapter.upsertMany(state.entities as EntityState<TSummary>, payload);
      });
      builder.addCase(getAllSummaries.rejected, (state, { payload }) => {
        state.entitiesMeta.isLoading = false;
        if (payload) {
          state.entitiesMeta.apiError = payload;
        }
      });
      builder.addCase(getById.pending, state => {
        state.entityMeta.isLoading = true;
        state.entityMeta.apiError = undefined;
      });
      builder.addCase(getById.fulfilled, (state, { payload }) => {
        state.entitiesMeta.isLoading = false;
        (state.entity as T) = payload;
      });
      builder.addCase(getById.rejected, (state, { payload }) => {
        state.entityMeta.isLoading = false;
        if (payload) {
          state.entityMeta.apiError = payload;
        }
      });
    }
  });

  const summarySelectors = entityAdapter.getSelectors();
  const selectors = {
    summaries: {
      isLoading: createSelector(
        selectSliceState,
        state => state.entitiesMeta.isLoading,
      ),
      apiError: createSelector(
        selectSliceState,
        state => state.entitiesMeta.apiError,
      ),
      all: createSelector(
        selectSliceState,
        state => summarySelectors.selectAll(state.entities),
      ),
    },
    entity: {
      isLoading: createSelector(
        selectSliceState,
        state => state.entityMeta.isLoading,
      ),
      apiError: createSelector(
        selectSliceState,
        state => state.entityMeta.apiError,
      ),
      data: createSelector(
        selectSliceState,
        state => state.entity,
      ),
    },
  };

  return {
    reducer: slice.reducer,
    useSummaries: () => {
      const dispatch = useDispatch();
      const fields = useSelector(selectors.summaries.all);
      const isLoading = useSelector(selectors.summaries.isLoading);
      const error = useSelector(selectors.summaries.apiError);

      useEffect(() => {
        dispatch(getAllSummaries());
      }, [dispatch]);

      return {
        fields,
        isLoading,
        error,
      }
    },
    selectors,
    actions: {
      getAllSummaries,
      getById: (id: TId) => getById(id),
    },
  }
};
