import { Stack, Avatar, Typography } from "@mui/material"

const PermissionsTableUser = (children: string) => {
    return (
        <Stack spacing={2} direction="row" alignItems="center">
            <Avatar>{children.split(" ")[0][0]+children.split(" ")[1][0]}</Avatar>
            <Typography noWrap>{children}</Typography>
        </Stack>
    )
}

export default PermissionsTableUser;