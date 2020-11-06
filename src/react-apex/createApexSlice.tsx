import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { get, HttpClientError, post } from './httpClient';

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
    apiError?: HttpClientError,
  };
  entity?: T,
  entityMeta: {
    isLoading: boolean,
    apiError?: HttpClientError,
  },
  createEntityMeta: {
    isSubmitting: boolean,
    apiError?: HttpClientError,
  },
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
      rejectValue: HttpClientError,
    }
  >(
    `${name}/fetchAll`,
    async (_, { rejectWithValue }) => {
      const response = await get<TSummary[]>(endpoint);
      return response.ok ?
        response.content as TSummary[] :
        rejectWithValue(response);
    }
  );

  const getById = createAsyncThunk<
    T,
    TId,
    {
      rejectValue: HttpClientError,
    }
  >(
    `${name}/getById`,
    async (id, { rejectWithValue }) => {
      const response = await get<T>(`${endpoint}/${id}`);
      return response.ok ?
        response.content as T :
        rejectWithValue(response);
    }
  );

  const create = createAsyncThunk<
    {},
    T,
    {
      rejectValue: HttpClientError,
    }
  >(
    `${name}/create`,
    async (entity, { rejectWithValue }) => {
      const response = await post(`${endpoint}`, entity);
      return response.ok ?
        {} :
        rejectWithValue(response);
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
    createEntityMeta: {
      isSubmitting: false,
      apiError: undefined,
    },
  };

  const slice = createSlice({
    name,
    initialState,
    reducers: {
    },
    extraReducers: builder => {
      // getAllSummaries
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
        state.entitiesMeta.apiError = payload;
      });
      // getById
      builder.addCase(getById.pending, state => {
        state.entityMeta.isLoading = true;
        state.entityMeta.apiError = undefined;
        state.entity = undefined;
      });
      builder.addCase(getById.fulfilled, (state, { payload }) => {
        state.entitiesMeta.isLoading = false;
        (state.entity as T) = payload;
      });
      builder.addCase(getById.rejected, (state, { payload }) => {
        state.entityMeta.isLoading = false;
        state.entityMeta.apiError = payload;
      });
      // create
      builder.addCase(create.pending, state => {
        state.createEntityMeta.isSubmitting = true;
        state.createEntityMeta.apiError = undefined;
      });
      builder.addCase(create.fulfilled, state => {
        state.createEntityMeta.isSubmitting = false;
      });
      builder.addCase(create.rejected, (state, { payload }) => {
        state.createEntityMeta.isSubmitting = false;
        state.createEntityMeta.apiError = payload;
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
    createEntity: {
      isSubmitting: createSelector(
        selectSliceState,
        state => state.createEntityMeta.isSubmitting,
      ),
      apiError: createSelector(
        selectSliceState,
        state => state.createEntityMeta.apiError,
      ),
    },
  };

  const actions = {
    getAllSummaries,
    getById: (id: TId) => getById(id),
    create: (entity: T) => create(entity),
  };

  return {
    reducer: slice.reducer,
    useSummaries: () => {
      const dispatch = useDispatch();
      const summaries = useSelector(selectors.summaries.all);
      const isLoading = useSelector(selectors.summaries.isLoading);
      const error = useSelector(selectors.summaries.apiError);

      useEffect(() => {
        dispatch(actions.getAllSummaries());
      }, [dispatch]);

      return {
        summaries,
        isLoading,
        error,
      }
    },
    useEntityById: (id: TId) => {
      const dispatch = useDispatch();
      const entity = useSelector(selectors.entity.data);
      const isLoading = useSelector(selectors.entity.isLoading);
      const error = useSelector(selectors.entity.apiError);

      useEffect(() => {
        dispatch(actions.getById(id));
      }, [dispatch, id]);

      return {
        entity,
        isLoading,
        error,
      }
    },
    useCreate: () => {
      const dispatch = useDispatch();
      const isSubmitting = useSelector(selectors.createEntity.isSubmitting);
      const error = useSelector(selectors.createEntity.apiError);
      return {
        create: (entity: T) => dispatch(actions.create(entity)),
        isSubmitting,
        error,
      }
    },
    selectors,
    actions,
  }
};
