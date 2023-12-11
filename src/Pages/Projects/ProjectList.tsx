import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostAddRounded } from '@mui/icons-material';
import ContentCard from '../../Components/ContentCard';
import ContentHeader from '../../Components/ContentHeader';
import DaregTable, { Column } from '../../Components/EntityTable/EntityTable';
import { DaregAPIResponse } from '../../types/global';
import { Project, useGetProjectsQuery } from '../../Services/projects';
import DateTimeFormatter from '../../Components/DateTimeFormatter';

const ProjectsList = () => {

  const [ page, setPage ] = useState(1)
  const {data: projects, isLoading} = useGetProjectsQuery(page)
  const navigate = useNavigate()

  const tableColumns: Column<Project>[] = [
    { id: 'name', label: 'Name', minWidth: 200 },
    { id: 'description', label: 'Description', minWidth: 400 },
    { id: 'facility', label: 'Facility', minWidth: 200, renderCell: (params: any) => (params.facility.abbreviation)},
    { id: 'created_by', label: 'Creator', minWidth: 200, renderCell: (params: any) => (params.created_by?.full_name || "Unknown")},
    { id: 'created', label: 'Creation', minWidth: 200, renderCell: (params: any) => <DateTimeFormatter>{params.created}</DateTimeFormatter> },
    { id: 'actions', label: 'Actions', minWidth: 200, renderCell: (params: any) => (
      <Button variant="contained" size="small" onClick={() => navigate(`/projects/${params.id}`)}>View</Button>
    )}
  ]

  return (
    <Box>
      <ContentHeader<Project> title={"Projects"} actions={
        <Button variant="contained" size="small" endIcon={<PostAddRounded />} onClick={() => navigate("/projects/new")}>
          Add new
        </Button>
      }>
      </ContentHeader>
      <ContentCard>
        <DaregTable
          loading={isLoading}
          columns={tableColumns}
          data={projects || {results: []} as unknown as DaregAPIResponse<Project>}
          page={page}
          setPage={setPage}
        />
      </ContentCard>
    </Box>
  );
}

export default ProjectsList;

