import { configureStore } from "@reduxjs/toolkit";
import { createApexSlice } from "./createApexSlice";

interface FieldSummary {
  id: string,
  label: string,
}

interface Field extends FieldSummary {
  helpText: string,
}

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