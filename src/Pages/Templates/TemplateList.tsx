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
import { useTranslation } from 'react-i18next';

const TemplateList = () => {
  const { t } = useTranslation()

  const [ page, setPage ] = useState<number>(1);
  const { data: schemas, isLoading } = useGetSchemasQuery(page)
  const navigate = useNavigate()

  const tableColumns: Column<Schema>[] = [
    { id: 'name', label: t('TemplateList.name'), minWidth: 200 },
    { id: 'description', label: t('TemplateList.description'), minWidth: 400 },
    { id: 'version', label: t('TemplateList.version'), minWidth: 200, renderCell: (params: any) => (params.version || "NaN")},
    { id: 'created_by', label: t('TemplateList.creator'), minWidth: 200, renderCell: (params: any) => (params.created_by?.full_name || "Unknown")},
    { id: 'created', label: t('TemplateList.creation'), minWidth: 200, renderCell: (params: any) => <DateTimeFormatter>{params.created}</DateTimeFormatter> },
    { id: 'actions', label: t('TemplateList.actions'), minWidth: 50, renderCell: (params: any) => (
      <Button variant="contained" size="small" onClick={() => navigate(`/templates/${params.id}`)}>{t('TemplateList.view')}</Button>
    )}
  ]

  return (
    <Box>
      <ContentHeader<Schema> title={t('TemplateList.templates')} actions={
        <Button variant="contained" size="medium" endIcon={<PostAddRounded />} onClick={() => navigate("/templates/new")}>
          {t('TemplateList.addNew')}
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

