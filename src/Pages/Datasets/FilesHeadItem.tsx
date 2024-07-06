/*
 *  Author: Tomáš Drdla (xdrdla04@stud.fit.vutbr.cz)
 */

import { ArrowDownwardRounded } from "@mui/icons-material";
import { Link, Stack, SxProps, Theme } from "@mui/material";
import { Box } from "@mui/system";

// Header label for files browser
const FilesHeadItem = (props: {
  sort: "down"|"up"|"none"
  anchor: "left"|"right",
  label: string,
  sx?: SxProps<Theme>,
  onClick: () => void
}) => {

  return (
    <Box display="flex" sx={props?.sx as any} flexDirection="row" justifyContent={props.anchor==="right"?"flex-end":"flex-start"}>
      <Link
        underline="none"
        color={(theme) => theme.palette.text.primary}
        component="button"
        fontSize={15}
        onClick={props.onClick}
        sx={{
          fontWeight: 500,
          opacity: props.sort==="none" ? 0.5 : 1,
          '& svg': {
            opacity: props.sort==="none" ? 0 : 0.5,
            transition: '0.2s',
            transform:
              props.sort === 'down' ? 'rotate(0deg)' : 'rotate(180deg)',
          },
          '&:hover': { '& svg': { opacity: 1 } },
        }}
        >
        <Stack direction="row" alignItems="center">
          {props.anchor==="right" ? (
            <ArrowDownwardRounded sx={{ marginRight: 0.5, fontSize: 20}} fontSize="inherit" />
          ) : null}
          {props.label}
          {props.anchor==="left" ? (
            <ArrowDownwardRounded sx={{ marginLeft: 0.5, fontSize: 20}} fontSize="inherit" />
          ) : null}
        </Stack>
      </Link>
    </Box>
  )
}

export default FilesHeadItem;
