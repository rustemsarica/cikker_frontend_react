import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { useStateContext } from "../../components/contexts/ContextProvider";

export default function LeftSidebar(props) {
    const {token, username,setName, setUserId, setToken} = useStateContext();
    const { formModalOpen } = props;

    const onLogout = () => {        
        setName(null)
        setUserId(null)
        setToken(null)
    }
  return (
    
    <Card sx={{ textAlign: 'left', height:'100vh', borderRadius:0, boxShadow:'none',}}>
        <CardContent sx={{pt:0}}>            
            <nav>
                <Box sx={{display:'flex', flexDirection:'row', alignItems:'center', px:2, py:2}}>
                    <FlutterDashIcon sx={{  mr: 1 }} color='inherit' fontSize="large" />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        }}
                    >
                        Cikker
                    </Typography>
                </Box>
                <Divider />
                
                    {token==null
                    ?
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton href='/auth/login'>
                                <ListItemIcon>
                                    <HomeIcon color='primary' fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton href='/auth/register'>
                                <ListItemIcon>
                                    <HomeIcon color='primary' fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primary="Register" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    :
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton href='/'>
                                <ListItemIcon>
                                    <HomeIcon color='primary' fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton href={"/"+username}>
                                <ListItemIcon>
                                    <PersonIcon color='primary'fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton href="/messages">
                                <ListItemIcon>
                                    <ChatIcon color='primary' fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primary="Messages" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={formModalOpen}>
                                <ListItemIcon>
                                    <AddIcon color='primary' fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primary="Cikle" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={onLogout}>
                                <ListItemIcon>
                                    <ExitToAppIcon color='error' fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton href='/settings'>
                                <ListItemIcon>
                                    <SettingsIcon color='primary' fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primary="Settings" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    }
                    
                
            </nav>
        
        </CardContent>
    </Card>
  );
}