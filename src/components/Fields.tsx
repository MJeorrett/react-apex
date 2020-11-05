import React from 'react';

import { fieldsSlice } from '../store';

const Fields = () => {
  const summaries = fieldsSlice.useSummaries();
  const entityById = fieldsSlice.useEntityById('abc');

  return (
    <>
      <h1>Summaries</h1>
      <pre>{JSON.stringify(summaries, null, 2)}</pre>

      <h1>Entity</h1>
      <pre>{JSON.stringify(entityById, null, 2)}</pre>
    </>
  );
};

export default Fields;
