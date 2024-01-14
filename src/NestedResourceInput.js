import React from 'react';
import ResourceFieldInput from './ResourceFieldInput';

function NestedResourceInput({ fieldName, schema, onInputChange, inputData }) {
  return (
    <div>
      <h4>{fieldName}</h4>
      <ResourceFieldInput
        schema={schema.properties}
        onInputChange={onInputChange}
        inputData={inputData || {}}
      />
    </div>
  );
}

export default NestedResourceInput;
