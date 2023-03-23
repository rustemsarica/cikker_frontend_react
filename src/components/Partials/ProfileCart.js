import React, { useState } from "react";
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import axiosClient from "../../axios-client";
import Button from '@mui/material/Button';
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Link from '@mui/material/Link';
import { enqueueSnackbar } from "notistack";
import { Box, CardContent } from "@mui/material";

function ProfileCart(props){
    const {data, userId} = props;
    const [followStatus, setFollowStatus ] = useState(data.followed);

    const follow = () => {
        var body = {
            userId : userId,
            followId: data.id
          };
        axiosClient.post("/follows",body)
        .then(()=>setFollowStatus(true))
        .catch((error) => {
            if(error.response.status===401){
                follow();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })
          
    }

    const unfollow = () => {
        var body = {
            userId : userId,
            followId: data.id
        };
        axiosClient.post("/follows/unfollow",body)
        .then(()=>setFollowStatus(false))
        .catch((error) => {
            if(error.response.status===401){
                unfollow();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })
    }

    return(
        <Card sx={{ textAlign: 'left' }}>
            <CardContent sx={{display:'flex', flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                <Box sx={{display: 'flex', flexDirection:'row', alignItems:'center'}}>
                    <Link href={'/' + data.username }>
                        <Avatar alt={data.username.charAt(0).toUpperCase()} src={"http://localhost:8080/uploads/avatars/"+data.id+".webp"} sx={{ width: 45, height: 45, mr:2 }} />
                    </Link>
                    <Link href={'/' + data.username }>
                        <Typography
                            variant="h6"
                            noWrap
                            component="span"
                            sx={{
                            mr: 2,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                            }}
                        >
                            {data.username}
                        </Typography>
                    </Link>
                </Box>
                { parseInt(data.id) === parseInt(userId) ? null : followStatus ?   
                <Button onClick={unfollow} variant="outlined" startIcon={<PersonRemoveAlt1Icon />}>
                    Unfollow
                </Button>
                :
                <Button onClick={follow} variant="outlined" startIcon={<PersonAddAlt1Icon />}>
                    Follow
                </Button>
                }
            </CardContent>          
        </Card>
    )
}

export default ProfileCart;