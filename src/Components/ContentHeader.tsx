import { or } from "@jsonforms/core"
import { AccessTime, AccountCircle, ArrowBackRounded, HomeRepairService } from "@mui/icons-material"
import { Paper, Stack, IconButton, Typography, SxProps, Avatar } from "@mui/material"
import { ReactFragment } from "react"
import { useNavigate } from "react-router-dom"

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

    const handleBackClick = (): void => {
        if (backAction){
            backAction()
        } else {
            navigate(-1)
        }
    }

    return (
        <Paper sx={{p: 2, mt:2, background: "#9ed060", ...sx}}>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" alignItems="center">
                    <IconButton sx={{ mr: 1 }} edge="start" onClick={() => handleBackClick()}><ArrowBackRounded/></IconButton>
                    <Typography variant="h5" color="text.primary">{title}</Typography>
                </Stack>
                {actions}
            </Stack>
            {children}
            {metadata ? (
                <Stack direction="row" justifyContent="start" spacing={3} sx={{mt:1}}>
                    {metadata.map((item, index) => {
                        return (
                            (item.renderCell || item.value) ? (
                            <Stack direction="row" spacing={1} alignItems="center" key={index}>
                                <Avatar sx={{color: "#32421e", background: "#e0e0e0"}} alt={item.label}>{item.icon}</Avatar>
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