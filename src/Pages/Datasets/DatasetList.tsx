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
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>([])

  const tableColumns: Column<Dataset>[] = [
    { id: 'name', label: 'Name', minWidth: 200 },
    { id: 'description', label: 'Description', minWidth: 400 },
    // facility
    { id: 'created_by', label: 'Creator', minWidth: 200, renderCell: (params: any) => (params.created_by?.full_name || "Unknown")},
    { id: 'created', label: 'Creation', minWidth: 200, renderCell: (params: any) => <DateTimeFormatter>{params.created}</DateTimeFormatter> },
    { id: 'actions', label: 'Actions', minWidth: 200, renderCell: (params: any) => (
        <Button variant="contained" size="small" onClick={() => navigate(`/projects/${params.project.id}/datasets/${params.id}`)}>View</Button>
    )}
  ]

  useEffect(() => {
    if (searchTerm.length === 0){
        setFilteredDatasets(data?.results as Dataset[])
    } else {
      const filtered = data?.results.filter((dataset) => dataset.name.includes(searchTerm) || dataset.description.includes(searchTerm))
      setFilteredDatasets(filtered as Dataset[])
    }
  }, [searchTerm, data])

  return (
    <Box>
      <ContentHeader title={"Datasets"} actions={<></>}>
      </ContentHeader>
      <ContentCard>
        <TextField
          margin="dense"
          label="Seach datasets"
          fullWidth
          variant="filled"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <DaregTable
          loading={isLoading}
          columns={tableColumns}
          data={{...data, results:filteredDatasets || []} as unknown as DaregAPIResponse<Dataset>}
          page={page}
          setPage={setPage}
        />
      </ContentCard>
    </Box>
  );
}

export default DatasetList;

