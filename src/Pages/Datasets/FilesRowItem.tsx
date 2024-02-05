/*
 *  Author: Tomáš Drdla (xdrdla04@stud.fit.vutbr.cz)
 */

import { Box, SxProps, Typography} from "@mui/material";
import { ReactElement } from "react";

// A wrapped Typography component with overflow handeling
const FilesRowItem = (props: {
  anchor: "left"|"right",
  sx?: SxProps,
  children: ReactElement|string
}) => {

  return (
    <Box display="flex" sx={props.sx} flexDirection="row" justifyContent={props.anchor==="right"?"flex-end":"flex-start"} overflow="auto">
      <Typography noWrap variant="body2" sx={{ userSelect: "none", MozUserSelect: "none" }}>
        {props.children}
      </Typography>
    </Box>
  )
}

export default FilesRowItem;