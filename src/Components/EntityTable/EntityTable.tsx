import { Table, TableBody, TableCell, TableHead, TableRow, Skeleton, TableProps, TableFooter, TablePagination, TextField } from '@mui/material';
import { Key, ReactFragment, useEffect, useState } from 'react';
import { DaregAPIResponse } from '../../types/global';
import { Dataset } from '../../Services/datasets';
import { useTranslation } from 'react-i18next';

export interface Column<T> {
    id: keyof T | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    renderCell?: (params: any) => ReactFragment;
}

interface Data {
    [key: string]: any;
}

interface Props<T> extends TableProps {
    columns: Column<T>[];
    data: DaregAPIResponse<T>;
    loading?: boolean;
    page?: number;
    setPage?: (page: number) => void;
}

const DaregTable = <T, >({ columns, data, loading = false, page = 1, setPage = () => {}, ...other }: Props<T>) => {
    
    const { t } = useTranslation()

    const [ rowsPerPage, setRowsPerPage ] = useState(100);

    const [ searchTerm, setSearchTerm ] = useState<string>("")

    const [ filtered, setFiltered ] = useState<any[]>([])

    useEffect(() => {
        if (searchTerm.length === 0){
            setFiltered(data?.results)
        } else {
          const filtered = data.results.filter((item: any) => item.name.includes(searchTerm) || item.description.includes(searchTerm))
          setFiltered(filtered)
        }
      }, [searchTerm, data])
    
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage+1);
    };
    
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    // data = { results: [] } as unknown as DaregAPIResponse<T>;

    if (!loading && data) {
        console.log(data)
        return (
            <>
                <TextField
                    margin="dense"
                    size="small"
                    label={t('DaregTable.search')}
                    fullWidth
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Table sx={{ minWidth: 650 }} aria-label="simple table" {...other}>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id as string} align={column.align} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(filtered||data?.results).length >= 0 ? (
                        (filtered||data.results).map((row: T, i) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={`id-${i}`}>
                                    {columns.map((column) => {
                                        const value = row[column.id as keyof T];
                                        return (
                                            <TableCell key={column.id as string} align={column.align}>
                                                {column.renderCell ? column.renderCell(row) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    {t('DaregTable.noData')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={columns.length} align="right">
                                <TablePagination
                                    labelDisplayedRows={function defaultLabelDisplayedRows({ from, to, count }) { return `${from}–${to} ${t('DaregTable.of')} ${count !== -1 ? count : `${t('DaregTable.moreThan')} ${to}`}`; }}
                                    labelRowsPerPage={t('DaregTable.rowsPerPage')}
                                    component="div"
                                    count={data.count || -1}
                                    page={page-1}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </>
            );
    } else {
        return (
            <>
                <TextField
                    margin="dense"
                    size="small"
                    label={t('DaregTable.search')}
                    fullWidth
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id as string} align={column.align} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(3)].map((_, i) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={`skeleton-${i}`}>
                                {columns.map((column) => (
                                    <TableCell key={column.id as string} align={column.align}>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </>
        );  
    }
}

export default DaregTable;