import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';

import { useStateContext } from "../../components/contexts/ContextProvider";
import { ArrowBack } from '@mui/icons-material';

export default function BottomNav(props) {
  const {username}=useStateContext();
  const { formModalStatus, formModalOpen } = props;

  return (
    <Box sx={{
        position:'fixed',
        bottom:0,
        width:'100%',
        zIndex:2,
        p:0,
        boxShadow:'none',
        border:'none',
        borderRadius:0, 
        display:{xs:'block', md:'none'}
        }}
        >
      <BottomNavigation
        showLabels
        value={formModalStatus ? 2 : localStorage.getItem("PAGE_NAME")==="Home" ? 0 :localStorage.getItem("PAGE_NAME")===username ? 1 :  localStorage.getItem("PAGE_NAME")==="Messages" || localStorage.getItem("PAGE_NAME").includes(<ArrowBack></ArrowBack>) ? 3 : localStorage.getItem("PAGE_NAME")==="Settings" ? 4 : 0}   
      >
        <BottomNavigationAction sx={{minWidth:'50px'}} label="Home" href='/' icon={<HomeIcon />} />
        <BottomNavigationAction sx={{minWidth:'50px'}} label="Profile" href={'/'+ username ? username : 'auth/login' } icon={<PersonIcon />} />
        <BottomNavigationAction sx={{minWidth:'50px'}} onClick={formModalOpen} label="Cikle" icon={<AddIcon />} />
        <BottomNavigationAction sx={{minWidth:'50px'}} label="Messages" href='/messages' icon={<ChatIcon />} />
        <BottomNavigationAction sx={{minWidth:'50px'}} label="Settings" href='/settings' icon={<SettingsIcon />} />
      </BottomNavigation>
      
    </Box>
  );
}