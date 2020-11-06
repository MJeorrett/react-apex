import React from 'react';
import { Form, Field, FormikProps, withFormik } from 'formik';

interface OtherProps<T> {
  fieldLabels: { [key in keyof T]?: string }
}

function InnerForm<T extends { [key: string]: any }>({
  fieldLabels,
  touched,
  errors,
}: FormikProps<T> & OtherProps<T>) {
  return (
    <Form>
      {Object.keys(fieldLabels).map(key => (
        <div key={key}>
          <label>{fieldLabels[key]}</label>
          <Field type="string" name={key} />
            {touched[key] && errors[key] && <div>{errors[key]}</div>}
          </div>
      ))}
      <button type="submit">Submit</button>
    </Form>
  );
}

interface MyFormProps<T> {
  fieldLabels: { [key in keyof T]?: string }
}

export default function createApexForm<T>() {
  return withFormik<MyFormProps<T>, T>({
    mapPropsToValues: ({ fieldLabels }) => {
      const result: any = {};

      Object.keys(fieldLabels).forEach(key => {
        result[key] = '';
      });

      return result;
    },
    handleSubmit: values => {
      console.log('Values:', values);
    }
  })(InnerForm);
}