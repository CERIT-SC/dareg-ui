import { DesignServices } from "@mui/icons-material"
import { Paper, Stack, Typography, Button, SxProps, PaperProps } from "@mui/material"
import TemplateEditor from "./TemplateEditor"

type ContentCardProps = {
    children: JSX.Element | JSX.Element[], 
    title?: string, 
    actions?: JSX.Element | JSX.Element[], 
    sx?: SxProps,
    paperProps?: PaperProps
}

const ContentCard = ({children, title, actions, sx, paperProps}: ContentCardProps) => {
    return (
        <Paper variant="outlined" sx={{p: 2, mt:2, ...sx}} {...paperProps}>
            {actions || title ? 
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb:2}}>
                    <Typography variant="h5" color="text.primary">{title}</Typography>
                    <Stack direction="row" spacing={1} justifyContent="end" alignItems="center">
                        {actions}
                    </Stack>
                </Stack>
            : null}
            {children}
        </Paper>
    )
}

export default ContentCard