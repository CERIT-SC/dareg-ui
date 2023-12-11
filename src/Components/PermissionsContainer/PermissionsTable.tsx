import { Delete } from "@mui/icons-material"
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Stack, Avatar, Typography, FormControl, InputLabel, Select, MenuItem, IconButton } from "@mui/material"
import PermissionsTableUser from "./PermissionsTableUser"

const PermissionsTableRow = (rowData: any) => {
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                <Stack spacing={2} direction="row" alignItems="center">
                    <Avatar>AR</Avatar>
                    <Typography noWrap>Adrian Rosinec</Typography>
                </Stack>
            </TableCell>
            <TableCell>Direct member by Tomas Svoboda</TableCell>
            <TableCell>
            <FormControl fullWidth>
                <InputLabel id="permissions-role">Role</InputLabel>
                <Select
                    labelId="permissions-role"
                    id="permissions-role-select"
                    value={1}
                    label="Role"
                    onChange={() => {}}
                >
                    <MenuItem value={1}>Owner</MenuItem>
                    <MenuItem value={2}>Reader</MenuItem>
                    <MenuItem value={3}>Editor</MenuItem>
                </Select>
                </FormControl>
            </TableCell>
            <TableCell>Last activity: Oct 12, 2023</TableCell>
            <TableCell>
                <IconButton aria-label="delete" color="error">
                    <Delete />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}
const PermissionsTable = () => {
    return (
        <TableContainer component={Paper}>
        <Table aria-label="Table for permissions management.">
            <TableHead>
            <TableRow>
                <TableCell>Account</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Max Role</TableCell>
                <TableCell>Activity</TableCell>
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
                <PermissionsTableRow />
            </TableBody>
        </Table>
    </TableContainer>
    )
}

export default PermissionsTable