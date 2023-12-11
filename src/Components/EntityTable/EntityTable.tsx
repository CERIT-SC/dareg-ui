import { Table, TableBody, TableCell, TableHead, TableRow, Skeleton, TableProps, TableFooter, TablePagination } from '@mui/material';
import { Key, ReactFragment, useState } from 'react';
import { DaregAPIResponse } from '../../types/global';

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

    const [ rowsPerPage, setRowsPerPage ] = useState(25);
    
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // data = { results: [] } as unknown as DaregAPIResponse<T>;

    if (!loading && data) {
        console.log(data)
        return (
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
                    {data?.results.length >= 0 ? (
                    data.results.map((row: T, i) => {
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
                                No data available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={columns.length} align="right">
                            <TablePagination
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

            );
    } else {
        return (
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
        );  
    }
}

export default DaregTable;