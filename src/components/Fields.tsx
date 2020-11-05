import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fieldsSlice } from '../store';

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

export default Fields;
