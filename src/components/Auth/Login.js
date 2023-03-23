import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Grid from '@mui/material/Grid';
import { useStateContext } from "../../components/contexts/ContextProvider";
import { Container } from "@mui/material";
import axiosClient from "../../axios-client";
import {  enqueueSnackbar } from 'notistack';

function Login(){
    const navigate = useNavigate();
    const {setName, setUserId, setToken, setRefreshToken, setPageName} = useStateContext();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onSubmit = (ev)=>{
        ev.preventDefault()
        axiosClient.post('/auth/login',{
            username: username,
            password: password,
        })
        .then(({data}) => {
            if(data.id>0){
                setName(data.username);
                setUserId(data.id);
                setToken(data.token);
                setRefreshToken(data.refreshToken)
                navigate("/");
            }else{
                enqueueSnackbar(data.token,{variant:"error"})
            }
            
        })
    }

    useEffect(()=>{
        setPageName("Login");
    })


    return (
        <Container>
            <Grid container direction="row" justifyContent="center" alignItems="center"> 
                <Grid item xs={12} md={6}>                   
                    <form onSubmit={onSubmit}>
                        <Card sx={{ textAlign: 'left' }}>
                            <CardContent>                                 
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <InputLabel htmlFor="outlined-adornment-amount">Username</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        label="Username" 
                                        onChange={(ev)=>setUserName(ev.target.value)}
                                    />
                                </FormControl>
                                <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={(ev)=>setPassword(ev.target.value)}
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </CardContent>
                            <CardActions sx={{display:'flex', flexDirection:'row-reverse', p:2}} >
                                <Button type="Submit" variant="contained">Login</Button>
                                
                                <Button variant="outlined" href="/auth/register" sx={{mr:1}}>Register</Button>
                            </CardActions>
                        </Card>                        
                    </form>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Login;