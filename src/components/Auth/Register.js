import React from "react";
import { useState } from "react";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Grid from '@mui/material/Grid';
import { Container } from "@mui/material";
import axiosClient from "../../axios-client";
import {  enqueueSnackbar } from 'notistack';
import { useStateContext } from "../../components/contexts/ContextProvider";

function Register(){
    const {setPageName} = useStateContext();
    setPageName("Register");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState(null);

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onSubmit = (ev)=>{
        ev.preventDefault()

        axiosClient.post('/auth/register',{
            username: username,
            password: password,
        })
        .then(({data}) => {
            enqueueSnackbar(data.message,{variant:data.status})
        })
        .catch((err) => setErrors(err))
    }

    return (
        <Container>
            <Grid container direction="row" justifyContent="center" alignItems="center"> 
                <Grid item xs={12} md={6}>                 
                    <form onSubmit={onSubmit}>
                        <Card sx={{ textAlign: 'left' }}>
                            <CardContent> 
                                { errors &&
                                <Stack sx={{ width: '100%' }} spacing={2}>
                                    {Object.keys(errors).map(key => (
                                        <Alert key={key} severity="error">{errors[key][0]}</Alert>
                                    ))}
                                </Stack>
                                }
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <InputLabel htmlFor="outlined-adornment-amount">Username</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        label="Username" 
                                        onChange={(ev)=>setUsername(ev.target.value)}
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
                            <CardActions disableSpacing sx={{display:'flex', flexDirection:'row-reverse', p:2}} >
                                <Button type="Submit" variant="contained">Register</Button>
                                <Button variant="outlined" href="/auth/login" sx={{mr:1}}>Login</Button>
                            </CardActions>
                        </Card>                    
                    </form>
                </Grid>    
            </Grid>
        </Container>
    )
}

export default Register;