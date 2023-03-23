import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import Box from '@mui/material/Box';
import { useStateContext } from "../../components/contexts/ContextProvider";

function Settings(){
    const {themeMode,setPageName, setThemeMode} = useStateContext();
    setPageName("Settings");


    const colorMode = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    };

  
    return(
        <Card sx={{ textAlign: 'left',boxShadow:'none', border:'none' }}>
            <CardContent>
                <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    borderRadius: 1,
                    p: 3,
                }}
                >
                {themeMode} mode
                    <IconButton sx={{ ml: 1 }} onClick={colorMode} color="inherit">
                        {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>
            </CardContent>            
        </Card>
    )
}

export default Settings;