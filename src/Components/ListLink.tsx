import { Box, Card, CardContent, Divider, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '4px' }}
  >
    •
  </Box>
);

const ListLink = (props: {name: string, username: string, date: string, disabled: boolean, onClick: () => void}) => {
  return (
      <>
        <ListItemButton disabled={props.disabled} sx={{ padding: 0 }} onClick={props.onClick}>
          <Stack sx={{ padding: "0.5rem 1rem", justifyContent: "space-between", flexGrow: 1}} direction="row">
            <Typography noWrap maxWidth={400}>{props.name}</Typography>
            <Typography noWrap maxWidth={250}>{props.username} {bull} {props.date}</Typography>
          </Stack>
        </ListItemButton>
        <Divider/>
      </>

  );
}

export default ListLink;
