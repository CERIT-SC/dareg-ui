import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentHeader from '../../Components/ContentHeader';
import { PostAddRounded } from '@mui/icons-material';
import ContentCard from '../../Components/ContentCard';
import DaregTable, { Column } from '../../Components/EntityTable/EntityTable';
import { DaregAPIResponse } from '../../types/global';
import { Schema, useGetSchemasQuery } from '../../Services/schemas';
import DateTimeFormatter from '../../Components/DateTimeFormatter';

const TemplateList = () => {


  const [ page, setPage ] = useState<number>(1);
  const { data: schemas, isLoading } = useGetSchemasQuery(page)
  const navigate = useNavigate()

  const tableColumns: Column<Schema>[] = [
    { id: 'name', label: 'Name', minWidth: 200 },
    { id: 'description', label: 'Description', minWidth: 400 },
    { id: 'created_by', label: 'Creator', minWidth: 200, renderCell: (params: any) => (params.created_by?.full_name || "Unknown")},
    { id: 'created', label: 'Creation', minWidth: 200, renderCell: (params: any) => <DateTimeFormatter>{params.created}</DateTimeFormatter> },
    { id: 'actions', label: 'Actions', minWidth: 50, renderCell: (params: any) => (
      <Button variant="contained" size="small" onClick={() => navigate(`/templates/${params.id}`)}>View</Button>
    )}
  ]

  return (
    <Box>
      <ContentHeader<Schema> title={"Templates"} actions={
        <Button variant="contained" size="medium" endIcon={<PostAddRounded />} onClick={() => navigate("/templates/new")}>
          Add new
        </Button>
      }>
      </ContentHeader>
      <ContentCard>
        <DaregTable columns={tableColumns} data={schemas || { results: [] } as unknown as DaregAPIResponse<Schema>} page={page} setPage={setPage} />
      </ContentCard>
    </Box>
  );
}

export default TemplateList;

