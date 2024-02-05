import { Autocomplete, Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useFetch } from "use-http";
import { DaregAPIObjectBase, DaregAPIObjectExtended, DaregAPIResponse, SchemasData } from "../types/global";
import { useGetSchemasQuery } from "../Services/schemas";

type Props<T> = {
  label: string,
  selectedId: string,
  setSelectedId: (value: string) => void
  entities: DaregAPIResponse<T>
}

const TemplateSelect = <T extends DaregAPIObjectExtended>({label, selectedId, setSelectedId, entities}: Props<T>) => {

  return (
    <>
      <Autocomplete
        disableClearable
        id="combo-box-demo"
        options={entities?.results || []}
        sx={{ml: 0, width: "33%", background: "background"}}
        getOptionLabel={(option: T) => option.name}
        value={entities?.results.find((template: T) => template.id === selectedId) as NonNullable<T> || undefined}
        onChange={(e, value) => setSelectedId((value as T).id as string)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => <TextField variant="outlined" {...params} label={label} />}
      />
    </>
  )
};

export default TemplateSelect;