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
import { useTranslation } from 'react-i18next';

const DatasetList = () => {

  const { t } = useTranslation()

  const [ page, setPage ] = useState(1)
  const {data, isLoading} = useGetDatasetsQuery({page: page, projId: undefined})
  const navigate = useNavigate()

  const tableColumns: Column<Dataset>[] = [
    { id: 'name', label: t('DatasetList.name'), minWidth: 200 },
    { id: 'description', label: t('DatasetList.description'), minWidth: 400 },
    // facility
    { id: 'created_by', label: t('DatasetList.creator'), minWidth: 200, renderCell: (params: any) => (params.created_by?.full_name || "Unknown")},
    { id: 'created', label: t('DatasetList.creation'), minWidth: 200, renderCell: (params: any) => <DateTimeFormatter>{params.created}</DateTimeFormatter> },
    { id: 'actions', label: t('DatasetList.actions'), minWidth: 50, renderCell: (params: any) => (
        <Button variant="contained" size="small" onClick={() => navigate(`/collections/${params.project.id}/datasets/${params.id}`)}>{t('DatasetList.view')}</Button>
    )}
  ]

  return (
    <Box>
      <ContentHeader title={t('DatasetList.datasets')} actions={<></>}>
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

