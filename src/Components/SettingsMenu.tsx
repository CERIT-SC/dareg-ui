import { Box, Button, Card, Divider, Grid, List, Menu, MenuItem, Stack, Typography } from '@mui/material';
import React from 'react';

const SettingsMenu = (props: {bttnText: string, options: {[key: string]: string}, onClick: (option: any) => void} ) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button onClick={handleClick}>
        {props.bttnText}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {Object.entries(props.options).map(([key, option]) => (
          <MenuItem onClick={() => {props.onClick(key); handleClose()}}>{option}</MenuItem>  
        ))}
      </Menu>
    </>
  );
}

export default SettingsMenu;

