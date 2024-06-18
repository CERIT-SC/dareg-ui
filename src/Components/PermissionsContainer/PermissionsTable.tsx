import { CheckRounded, Close, Delete, Done, DoneRounded, GroupAdd, HowToRegRounded, MultipleStop } from "@mui/icons-material"
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Stack, Avatar, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, Modal, Dialog, DialogTitle, DialogContent, DialogActions, Button, Link, colors, DialogContentText } from "@mui/material"
import PermissionsTableUser from "./PermissionsTableUser"
import { useState } from "react"
import TemplateSelect from "../TemplateSelect"
import { DaregAPIObjectExtended, DaregAPIResponse, SharesList, UserData } from "../../types/global"
import ContentCard from "../ContentCard"
import { ThemeContext } from "@emotion/react"
import { PermissionModes } from "../../types/enums"
import { useFetch } from "use-http"
import { UsersResponse, useGetUsersQuery } from "../../Services/users"
import { useTranslation } from "react-i18next"

const PermissionsTableRow = (props: {
        rowData: {id: string, name: string, perms: string},
        perms: PermissionModes,
        updateShare: (id: string, perms: "owner"|"editor"|"viewer") => void
        removeShare: (id: string) => void,
}) => {
    const { t } = useTranslation()

    return (
        <TableRow>
            <TableCell component="th" scope="row">
                <Stack spacing={2} direction="row" alignItems="center">
                    <Avatar>AR</Avatar>
                    <Typography noWrap>{props.rowData.name}</Typography>
                </Stack>
            </TableCell>
            <TableCell>
            <FormControl fullWidth>
                <InputLabel id="permissions-role">{t("PermissionsTable.role")}</InputLabel>
                <Select
                    labelId="permissions-role"
                    id="permissions-role-select"
                    value={props.rowData.perms}
                    label="Role"
                    onChange={(e) => props.updateShare(props.rowData.id, e.target.value as "owner"|"editor"|"viewer")}
                    disabled={props.perms!=="owner" || props.rowData.perms=="owner"}
                >
                    {props.rowData.perms=="owner" ? <MenuItem value={"owner"}>{t("PermissionsTable.owner")}</MenuItem> : null}
                    <MenuItem value={"editor"}>{t("PermissionsTable.editor")}</MenuItem>
                    <MenuItem value={"viewer"}>{t("PermissionsTable.viewer")}</MenuItem>
                </Select>
                </FormControl>
            </TableCell>
            <TableCell>{t("PermissionsTable.lastActivity")}: Oct 12, 2023</TableCell>
            <TableCell>
                {props.perms==="owner" && props.rowData.perms!=="owner" ? <IconButton aria-label="delete" color="error" onClick={() => props.removeShare(props.rowData.id)}>
                    <Delete />
                </IconButton> : null}
            </TableCell>
        </TableRow>
    )
}


const PermissionsTable = (props: {perms: PermissionModes, currentShares: SharesList, setCurrentShares: (val: SharesList | ((array: SharesList) => SharesList)) => void}) => {
    const { t } = useTranslation()
    
    const [ newUserWindow, setNewUserWindow ] = useState<boolean>(false)
    const [ newUserId, setNewUserId ] = useState<string>("")
    const [ newUserPerm, setNewUserPerm ] = useState<"editor"|"viewer">("viewer")
    const [ transferWindow, setTransferWindow ] = useState<boolean>(false)

    const [ transferUserId, setTransferUserId ] = useState<string>("")

    const {data: users} = useGetUsersQuery(1)
    const newUsersList = users ? users.results.filter(user => user.name!==" " && !props.currentShares.some(share => share.id === user.id)) : []

    const addNewShare = () => {
        const newUser = {...newUsersList.find(user => user.id === newUserId), perms: newUserPerm}
        props.setCurrentShares(array => [...array, newUser] as SharesList)
        setNewUserWindow(false)
        setNewUserId("")
    }

    const updateShare = (id: string, perms: "owner"|"editor"|"viewer") => {
        props.setCurrentShares(array => array.map(item => (item.id === id ? { ...item, perms: perms } : item)))
    }

    const removeShare = (id: string) => {
        props.setCurrentShares(array => array.filter(item => item.id !== id))
    }

    const transferOwner = () => {
        const removedOwnerAndUser = props.currentShares.filter(item => item.perms!=="owner" && item.id!==transferUserId)
        const newUser = {...(users as UsersResponse).results.find(user => user.id === transferUserId), perms: "owner"}
        props.setCurrentShares([...removedOwnerAndUser, newUser] as SharesList)
        setTransferWindow(false)
    }

    return (
        <>
            <ContentCard title={t("PermissionsTable.permissions")} actions={
                <>
                    {props.perms==="owner" ? <Button variant="outlined" startIcon={<MultipleStop />} onClick={() => setTransferWindow(true)}>
                            {t("PermissionsTable.transferOwnership")}
                        </Button> : undefined}
                    {props.perms==="owner" ? <Button variant="outlined" startIcon={<GroupAdd />} onClick={() => setNewUserWindow(true)}>
                            {t("PermissionsTable.addUser")}
                        </Button> : undefined}
                </>
            }>
                <TableContainer component={Paper}>
                    <Table aria-label="Table for permissions management.">
                        <TableHead>
                        <TableRow>
                            <TableCell>{t("PermissionsTable.account")}</TableCell>
                            <TableCell>{t("PermissionsTable.role")}</TableCell>
                            <TableCell>{t("PermissionsTable.activity")}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.currentShares.map((row) => <PermissionsTableRow rowData={row} perms={props.perms} updateShare={updateShare} removeShare={removeShare} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ContentCard>

            <Dialog
                open={newUserWindow}
                onClose={() => setNewUserWindow(false)}
            >
                <DialogTitle>
                    {t("PermissionsTable.addUser")}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={0.75}>
                        <TemplateSelect width={"400px"} label={t("PermissionsTable.user")} selectedId={newUserId} setSelectedId={(val) => setNewUserId(val)} entities={{...users, results: newUsersList} as unknown as DaregAPIResponse<DaregAPIObjectExtended>}/>
                        <FormControl fullWidth>
                            <InputLabel id="permissions-role">{t("PermissionsTable.role")}</InputLabel>
                            <Select
                                labelId="permissions-role"
                                id="permissions-role-select"
                                value={newUserPerm}
                                label="Role"
                                onChange={(e) => {setNewUserPerm(e.target.value as "editor"|"viewer")}}
                                sx={{ width: 200 }}
                            >
                                <MenuItem value={"editor"}>{t("PermissionsTable.editor")}</MenuItem>
                                <MenuItem value={"viewer"}>{t("PermissionsTable.viewer")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button size="large" disabled={newUserId===""} onClick={addNewShare}>{t("PermissionsTable.add")}</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={transferWindow}
                onClose={() => setTransferWindow(false)}
            >
                <DialogTitle>
                    {t("PermissionsTable.transferOwnership")}
                </DialogTitle>
                <DialogContent>
                    <Stack mt={0.75} mb={2}>
                        <TemplateSelect width={"400px"} label={t("PermissionsTable.user")} selectedId={transferUserId} setSelectedId={(val) => setTransferUserId(val)} entities={{...users, results: users?.results.filter(item => item.name!==" ")} as unknown as DaregAPIResponse<DaregAPIObjectExtended>}/>
                    </Stack>
                    <Typography color="error">{t("PermissionsTable.transferWarning1")}</Typography>
                    <Typography color="error">{t("PermissionsTable.transferWarning2")}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button size="large" onClick={() => setTransferWindow(false)}>{t("PermissionsTable.cancel")}</Button>
                    <Button size="large" disabled={transferUserId===""} onClick={transferOwner}>{t("PermissionsTable.transfer")}</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default PermissionsTable