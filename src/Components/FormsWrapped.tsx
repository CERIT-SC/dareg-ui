import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import RatingControl from '../RatingControl';
import ratingControlTester from '../ratingControlTester';
import { JsonForms, JsonFormsInitStateProps } from '@jsonforms/react';
import { useMemo, useState } from 'react';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { Skeleton, Stack } from '@mui/material';

const renderers = [
  ...materialRenderers,
  //register custom renderers
  { tester: ratingControlTester, renderer: RatingControl },
];

export const loadJSON = (json: string) => {
  try {
    return (JSON.parse(json))
  }
  catch {
  }
}

type FormsWrappedProps = {
  schema: Object,
  uischema: Object,
  data: any,
  setData: (data: any) => void,
  setErrors?: (errors: any) => void,
} & Omit<JsonFormsInitStateProps, "data" | "renderers" | "cells" | "schema" | "uischema" | "onChange">

const FormsWrapped = ({schema, uischema, data, setData, setErrors, ...other}: FormsWrappedProps): JSX.Element => {

  //const JSschema = useMemo(() => loadJSON(schema), [schema])
  //const JSschemaui = useMemo(() => loadJSON(uischema), [uischema])

  return (
    <>
      <JsonForms
        schema={schema as JsonSchema}
        uischema={Object.keys(uischema).length > 0 ?  uischema as UISchemaElement : undefined}
        data={data}
        renderers={renderers}
        cells={materialCells}
        onChange={({ errors, data }) => {setData(data); if (setErrors) setErrors(errors)}}
        validationMode='ValidateAndShow'
        {...other}
        />
    </>
  )
};

export const FormsWrapperSkeleton = () => {
  return (
    <Stack direction="column" spacing={1} justifyContent="space-evenly">
      <Skeleton variant="text" width="50%" height={50} />
      <Stack direction="row" spacing={1} justifyContent="space-evenly">
        <Skeleton variant="rectangular" width="50%" height={50} />
        <Skeleton variant="rectangular" width="50%" height={50} />
      </Stack>
    </Stack>
  )
}

export default FormsWrapped;

