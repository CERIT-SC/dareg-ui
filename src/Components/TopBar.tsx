import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { AddRounded, NoteAddRounded, PostAddRounded, SortRounded } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginRight: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.5, 0.5, 0.5, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '25ch',
      '&:focus': {
        width: '44ch',
      },
    },
  },
}));

const TopBar = (props: {newOpen: () => void, projectView: boolean}) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const { t } = useTranslation()

  return (
    <AppBar position="static" sx={{ boxShadow: "none", borderRadius: "0px 0px 4px 4px" }} >
      <Toolbar sx={{ display:"flex", justifyContent:"space-between", flexGrow:"1" }} variant='dense'>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="open drawer"
          onClick={props.newOpen}
        >
          <PostAddRounded />
        </IconButton>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={props.projectView ? t("TopBar.searchProj") : t("TopBar.searchTemp")}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleOpenUserMenu}
        >
          <SortRounded />
        </IconButton>
        
        <Menu
          sx={{ mt: 3 }}
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={handleCloseUserMenu}>{t("TopBar.newest")}</MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>{t("TopBar.oldest")}</MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>{t("TopBar.az")}</MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>{t("TopBar.za")}</MenuItem>
        </Menu>


      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
