import React from 'react';

import { fieldsSlice } from '../store';

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

export default Fields;
