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
import { useTranslation } from 'react-i18next';

const ProjectsList = () => {
  const { t } = useTranslation()

  const [ page, setPage ] = useState(1)
  const {data: projects, isLoading} = useGetProjectsQuery(page)
  const navigate = useNavigate()

  const tableColumns: Column<Project>[] = [
    { id: 'name', label: t('ProjectList.name'), minWidth: 200 },
    { id: 'description', label: t('ProjectList.description'), minWidth: 400 },
    { id: 'facility', label: t('ProjectList.facility'), minWidth: 200, renderCell: (params: any) => (params.facility.abbreviation)},
    { id: 'created_by', label: t('ProjectList.creator'), minWidth: 200, renderCell: (params: any) => (params.created_by?.full_name || "Unknown")},
    { id: 'created', label: t('ProjectList.creation'), minWidth: 200, renderCell: (params: any) => <DateTimeFormatter>{params.created}</DateTimeFormatter> },
    { id: 'actions', label: t('ProjectList.actions'), minWidth: 50, renderCell: (params: any) => (
      <Button variant="contained" size="small" onClick={() => navigate(`/collections/${params.id}`)}>{t('ProjectList.view')}</Button>
    )}
  ]

  return (
    <Box>
      <ContentHeader<Project> title={t('ProjectList.collections')} actions={
        <Button variant="contained" size="medium" endIcon={<PostAddRounded />} onClick={() => navigate("/collections/new")}>
          {t('ProjectList.addNew')}
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

