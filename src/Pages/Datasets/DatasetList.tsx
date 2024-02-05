import { Box, Button, TablePagination, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostAddRounded } from '@mui/icons-material';
import ContentCard from '../../Components/ContentCard';
import ContentHeader from '../../Components/ContentHeader';
import { useFetch } from 'use-http';
import DaregTable, { Column } from '../../Components/EntityTable/EntityTable';
import { DaregAPIResponse, ProjectsData } from '../../types/global';
import { Project, useGetProjectsQuery } from '../../Services/projects';
import { Dataset, DatasetsResponse, useGetDatasetsQuery } from '../../Services/datasets';
import DateTimeFormatter from '../../Components/DateTimeFormatter';

const DatasetList = () => {

  const [ page, setPage ] = useState(1)
  const {data, isLoading} = useGetDatasetsQuery({page: page, projId: undefined})
  const navigate = useNavigate()

  const tableColumns: Column<Dataset>[] = [
    { id: 'name', label: 'Name', minWidth: 200 },
    { id: 'description', label: 'Description', minWidth: 400 },
    // facility
    { id: 'created_by', label: 'Creator', minWidth: 200, renderCell: (params: any) => (params.created_by?.full_name || "Unknown")},
    { id: 'created', label: 'Creation', minWidth: 200, renderCell: (params: any) => <DateTimeFormatter>{params.created}</DateTimeFormatter> },
    { id: 'actions', label: 'Actions', minWidth: 50, renderCell: (params: any) => (
        <Button variant="contained" size="small" onClick={() => navigate(`/collections/${params.project.id}/datasets/${params.id}`)}>View</Button>
    )}
  ]

  return (
    <Box>
      <ContentHeader title={"Datasets"} actions={<></>}>
      </ContentHeader>
      <ContentCard>
        <DaregTable
          loading={isLoading}
          columns={tableColumns}
          data={data as unknown as DaregAPIResponse<Dataset>}
          page={page}
          setPage={setPage}
        />
      </ContentCard>
    </Box>
  );
}

export default DatasetList;

