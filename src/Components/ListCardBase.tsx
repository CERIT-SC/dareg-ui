import { FC, ReactFragment } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const ListCardBase = (props: {children: ReactFragment}) => {
  return (
    <Box bgcolor={"background.default"} sx={{ overflowY: "auto" }} maxHeight="1">
      <CardContent>
        {props.children}
      </CardContent>
    </Box>
  );
}

export default ListCardBase;
