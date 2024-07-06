import { Box, Button, ButtonBase, Stack, Tooltip } from "@mui/material";
import { ReactElement, useState } from "react";

const MyIconButton = (props: {
    onClick?: () => void,
    children: ReactElement|string,
    tooltip?: string,
    disabled?: boolean,
}) => {
    const [hover, setHover] = useState(false);

    return (
        <Tooltip title={props.tooltip}>
            <Button 
                disabled={props.disabled}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={props.onClick}
                variant="text"
                sx={{ minWidth: 0, margin: 0.25, fontSize: 20 }}
                color="secondary"
                size="small"
                >
                    <Stack sx={{ transition: "color 0.1s" }}>{props.children}</Stack>
            </Button>
        </Tooltip>
        )
    }
    
export default MyIconButton;
