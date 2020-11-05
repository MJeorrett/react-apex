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
  const dispatch = useDispatch();
  const fields = useSelector(fieldsSlice.selectors.summaries.all);
  const isLoading = useSelector(fieldsSlice.selectors.summaries.isLoading);
  const error = useSelector(fieldsSlice.selectors.summaries.apiError);

  useEffect(() => {
    dispatch(fieldsSlice.actions.getAllSummaries());
  }, [dispatch]);

  return (
    <pre>{JSON.stringify({
      fields, isLoading, error,
    }, null, 2)}</pre>
  );
};
```