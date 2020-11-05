# React Apex
Opinionated toolkit for creating React CRUD applications on REST APIs.

## Running
#### Pre-requisites
- node
- yarn
- [json-server](https://github.com/typicode/json-server) installed globally.

#### Starting json-server
Start json-server by running this is in the project root:
```
json-server --watch db.json -d 1000
```

#### Start the app
Open another console in project root and run:
- `yarn install`
- `yarn start`

## Example Usage
```typescript
import { configureStore } from "@reduxjs/toolkit";
import { createApexSlice } from "./createApexSlice";

interface FieldSummary {
  id: string,
  label: string,
}

interface Field extends FieldSummary {
  helpText: string,
}

const fieldsSlice = createApexSlice<Field, FieldSummary, string>({
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

const Fields = () => {
  const summaries = fieldsSlice.useSummaries();
  const entityById = fieldsSlice.useEntityById('abc');

  return (
    <>
      <h2>Summaries</h2>
      <pre>{JSON.stringify(summaries, null, 2)}</pre>

      <h2>Entity</h2>
      <pre>{JSON.stringify(entityById, null, 2)}</pre>
    </>
  );
};
```