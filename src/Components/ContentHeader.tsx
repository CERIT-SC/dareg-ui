import { or } from "@jsonforms/core"
import { AccessTime, AccountCircle, ArrowBackRounded, HomeRepairService } from "@mui/icons-material"
import { Paper, Stack, IconButton, Typography, SxProps, Avatar, Box, Tooltip } from "@mui/material"
import { ReactFragment } from "react"
import { useLocation, useNavigate } from "react-router-dom"

type ContentHeaderProps<T> = {
    title?: string,
    backAction?: () => void,
    children?: JSX.Element | JSX.Element[],
    actions?: JSX.Element | JSX.Element[],
    sx?: SxProps
    metadata?: ContentHeaderMetadata<T>[]
}

export interface ContentHeaderMetadata<T> {
    id: keyof T | 'actions';
    label: string;
    icon: JSX.Element;
    renderCell?: (params: any) => ReactFragment;
    value: string;
}

const ContentHeader = <T, >({title, children, sx, backAction, actions, metadata}: ContentHeaderProps<T>) => {
    
    const navigate = useNavigate()
    const { pathname } = useLocation();

    const handleBackClick = (): void => {
        if (backAction){
            backAction()
        } else {
            navigate("..", { relative: "path" })
        }
    }

    return (
        <Paper variant="outlined" sx={{p: 2, mt:2, border: "solid", borderWidth: 1, borderColor: (theme) => theme.palette.superGreen.border, backgroundColor: (theme) => theme.palette.superGreen.bg, ...sx}}>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" alignItems="center">
                    {pathname.split('/').length > 2 ? 
                        <IconButton sx={{ mr: 1 }} edge="start" onClick={() => handleBackClick()}><ArrowBackRounded/></IconButton>
                    : null}
                    <Typography variant="subtitle2" fontSize={22} fontWeight={500} color="text.primary">{title}</Typography>
                </Stack>
                <Box>{actions}</Box>
            </Stack>
            {children}
            {metadata ? (
                <Stack direction="row" justifyContent="start" spacing={3} sx={{mt:1}}>
                    {metadata.map((item, index) => {
                        return (
                            (item.renderCell || item.value) ? (
                            <Stack direction="row" spacing={1} alignItems="center" key={index}>
                                <Tooltip title={item.label}>
                                    <Avatar sx={{color: (theme) => theme.palette.mode==='light' ? "#32421e" : theme.palette.text.primary, background: (theme) => theme.palette.background.paper}} alt={item.label}>{item.icon}</Avatar>
                                </Tooltip>
                                <Typography variant="body1" color="text.primary">{item.renderCell ? item.renderCell(item.value) : item.value}</Typography>
                            </Stack>
                            ) : null
                        )
                    })}
                </Stack>
            ) : null}     
        </Paper>
    )
}

export default ContentHeader;