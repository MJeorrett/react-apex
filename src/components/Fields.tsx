import React, { useState } from 'react';

import { fieldsSlice } from '../store';
import { Field } from '../models';
import createApexForm from '../react-apex/ApexForm';

const Fields = () => {
  const summaries = fieldsSlice.useSummaries();
  const entityById = fieldsSlice.useEntityById('abc');
  const { create } = fieldsSlice.useCreate();
  const [entityId, setEntityId] = useState('');

  const FieldForm = createApexForm<Field>();

  return (
    <>
      <FieldForm
        fieldLabels={{ label: 'Label', helpText: 'Help Text' }}
        onSubmit={create}
      />
      <h2>Summaries</h2>
      <pre>{JSON.stringify(summaries, null, 2)}</pre>

      <h2>Entity</h2>
      <label>Id</label>
      <input type="string" value={entityId} onChange={event => setEntityId(event.target.value)} /><br />
      <button onClick={() => entityById.getById(entityId)} disabled={entityById.isLoading}>Fetch</button>
      <pre>{JSON.stringify(entityById, null, 2)}</pre>
    </>
  );
};

export default Fields;
