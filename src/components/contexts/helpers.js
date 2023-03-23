import axiosClient from "../../axios-client"
import {  enqueueSnackbar } from 'notistack';

export const unauthorizedHandler = (error) => {
    axiosClient.post("/auth/refresh",{
        userId: localStorage.getItem("USERID"),
        refreshToken: localStorage.getItem("REFRESH_TOKEN"),
    })
    .then(
        ({data})=>{
            if(data.id>0){
                localStorage.setItem('ACCESS_TOKEN', data.token);
                localStorage.setItem('REFRESH_TOKEN', data.refreshToken);
                localStorage.setItem('USERID', data.id);
                localStorage.setItem('USERNAME', data.username);
            }else{
                enqueueSnackbar(data.token,{variant:"error"})
            }
        },
        (error)=>{
        }
    )
}