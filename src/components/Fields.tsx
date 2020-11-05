import React from 'react';

import { fieldsSlice } from '../store';

const Fields = () => {
  const { isLoading, error, fields } = fieldsSlice.useSummaries();

  return (
    <pre>{JSON.stringify({
      fields, isLoading, error,
    }, null, 2)}</pre>
  );
};

export default Fields;
