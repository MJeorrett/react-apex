import { configureStore } from "@reduxjs/toolkit";
import { createApexSlice } from "../react-apex/createApexSlice";
import { Field, FieldSummary } from '../models';

export const fieldsSlice = createApexSlice<Field, FieldSummary, string>({
  name: 'fields',
  endpoint: 'http://localhost:3000/fields',
  selectSummaryId: field => field.id,
  selectSliceState: state => state.fields,
})

const store = configureStore({
  reducer: {
    fields: fieldsSlice.reducer,
  },
});

export default store;