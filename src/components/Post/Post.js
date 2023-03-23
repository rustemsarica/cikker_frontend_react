import React, {useEffect,useState} from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {  enqueueSnackbar } from 'notistack';
import LoopIcon from '@mui/icons-material/Loop';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

import { useStateContext } from "../../components/contexts/ContextProvider";
import axiosClient from "../../axios-client";

import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import defaultAvatar from '../../user-128.png';
function Post(props){
    const {userId} = useStateContext();
    const {formModalOpen, setFormModalPostId, data,  refreshPosts}=props;
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(data.likes.length);
    const [likeId, setLikeId] = useState(null);
    const [anchorElPostSettings, setAnchorElPostSettings] = useState(null);

    const handleOpenPostSettingsMenu = (event) => {
        setAnchorElPostSettings(event.currentTarget);
    };

    const handleClosePostSettingsMenu = () => {
        setAnchorElPostSettings(null);
    };
    
    const onDelete = ()=>{
        axiosClient.delete("/posts/"+data.id)
        .then(({data})=>{
            refreshPosts();
            enqueueSnackbar(data.message,{variant:data.status});
        })
        .catch((error) => {
            if(error.response.status===401){
                onDelete();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })
        setAnchorElPostSettings(null);
    }

    const handleLike = () => {
        setIsLiked(!isLiked);
        if(!isLiked){
          saveLike();
        }
        else{
          deleteLike();
        }
          
    }

    const saveLike = () => {
        var body = {
            postId: data.id, 
            userId : userId,
          };
        axiosClient.post("/likes",body)
        .then(()=>{            
            setLikeCount(likeCount + 1)
        })
        .catch((error) => {
            if(error.response.status===401){
                saveLike();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })
    }

    const follow = () => {
        var body = {
            userId : userId,
            followId: data.userId
          };
        axiosClient.post("/follows",body)
        .then(()=>data.followed=true)
        .catch((error) => {
            if(error.response.status===401){
                follow();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })
          
        setAnchorElPostSettings(null);
    }

    const unfollow = () => {
        var body = {
            userId : userId,
            followId: data.userId
        };
        axiosClient.post("/follows/unfollow",body)
        .then(()=>data.followed=false)
        .catch((error) => {
            if(error.response.status===401){
                unfollow();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })
        setAnchorElPostSettings(null);
    }
    
    const deleteLike = () => {
        axiosClient.delete("/likes/"+likeId)
        .then(()=>setLikeCount(likeCount - 1))
        .catch((error) => {
            if(error.response.status===401){
                deleteLike();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })
    }

    const checkLikes = () => {
        var likeControl = data.likes.find((like =>  ""+like.userId === userId));
        if(likeControl != null){
          setLikeId(likeControl.id);
          setIsLiked(true);
        }
    }

    const sharePost = () => {
        formModalOpen();
        setFormModalPostId(data.id);
    }
      
    useEffect(() => {
        checkLikes();
    })
    
    return(
        <Card sx={{ textAlign: 'left',boxShadow:'none', borderRadius:0,  borderLeft:'2px solid', borderRight:'2px solid', borderColor:'primary.soft' }}>
            <CardHeader
                avatar={
                    <Link href={ '/' + data.username }>
                        
                        <Avatar alt={data.username.charAt(0).toUpperCase()} src={"http://localhost:8080/uploads/avatars/"+data.userId+".webp"} onError={(e) => { e.target.src = defaultAvatar; }} />
                                           
                    </Link>
                }
                action={<IconButton aria-label="settings" onClick={handleOpenPostSettingsMenu}><MoreVertIcon /></IconButton>}
                
                title={<Link href={"/" + data.username }>{data.username}</Link>}
                subheader={data.createdAt}
            />
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElPostSettings}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElPostSettings)}
                    onClose={handleClosePostSettingsMenu}
                    >
                        {parseInt(data.userId) === parseInt(userId) 
                        ? 
                        <MenuItem key="delete" onClick={onDelete}>
                            <Typography textAlign="center">Delete</Typography>
                        </MenuItem>
                        :
                        data.followed ?
                        <MenuItem key="unfollow"  onClick={unfollow}>
                            <PersonRemoveAlt1Icon sx={{mr:1}}></PersonRemoveAlt1Icon><Typography textAlign="center">Unfollow</Typography>
                        </MenuItem>
                        :
                        <MenuItem key="follow"  onClick={follow}>
                            <PersonAddAlt1Icon sx={{mr:1}}></PersonAddAlt1Icon><Typography textAlign="center">Follow</Typography>
                        </MenuItem>
                        }
                </Menu>
            <CardContent sx={{py:0}}>
                {data.text!=="" || data.text!=null ?               
                    <Typography variant="body2" color="text.secondary">
                        {data.text}
                    </Typography>
                :
                    null
                }
                {data.images && data.images.length>0 ? 
                    <Box sx={{ width: '100%', mb: 0}}>
                        <ImageList variant="masonry" cols={data.images.length} gap={8} rowHeight={250} sx={{mb:0}}>
                            { data.images.map((item) => (
                                
                                <ImageListItem key={data.images.indexOf(item)} >
                                    <img
                                        src={"http://localhost:8080"+item.url}
                                        srcSet={"http://localhost:8080"+item.url}
                                        sx={{width:248,height:300, objectFit:'cover'}}
                                        alt={item.id}
                                        loading="lazy"
                                    />
                                    
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box> 
                : 
                    null
                }
                {data.rt!=null ?
                    <Card sx={{ textAlign: 'left',boxShadow:'none', border:'none', mt:2 }}>
                        <CardHeader
                            avatar={<Avatar alt={data.rt.user.username.charAt(0).toUpperCase()} src={"http://localhost:8080/uploads/avatars/"+data.rt.user.id+".webp"} />}                
                            title={data.rt.user.username}
                            subheader={data.rt.createdAt}
                        />
                        <CardContent sx={{py:0, '&:last-child':{pb:0}}}>
                            {data.rt.text!=="" || data.rt.text!=null ?               
                                <Typography variant="body2" color="text.secondary">
                                    {data.rt.text}
                                </Typography>
                            :
                                null
                            }
                            {data.rt.images && data.rt.images.length>0 ? 
                                <Box sx={{ width: '100%', mb:0}}>
                                    <ImageList variant="masonry" cols={data.rt.images.length} gap={8} rowHeight={150} sx={{mb:0}}>
                                        {data.rt.images.map((item) => (
                                            
                                            <ImageListItem key={data.rt.images.indexOf(item)} >
                                                <img
                                                    src={"http://localhost:8080"+item.url}
                                                    srcSet={"http://localhost:8080"+item.url}
                                                    sx={{width:75,height:150, objectFit:'cover'}}
                                                    alt={item.id}
                                                    loading="lazy"
                                                />
                                                
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                </Box> 
                            : 
                                null
                            }
                        </CardContent>
                    </Card>
                :
                    null
                }
                
            </CardContent>
            <CardActions disableSpacing sx={{justifyContent:'space-around'}}>
                <IconButton aria-label="add to favorites">
                    <ChatBubbleOutlineOutlinedIcon /> 
                </IconButton>
                <IconButton aria-label="add to favorites" onClick={sharePost}>
                    <LoopIcon />
                </IconButton>   
                <IconButton aria-label="add to favorites" onClick={handleLike}>
                    <FavoriteIcon style={isLiked? { color: "red" } : null} sx={{mr:1}} /> <Typography variant="body2" color={isLiked? "red" : "text.secondary"}>{likeCount}</Typography>
                </IconButton>                   
            </CardActions>
        </Card>
    )
}

export default Post;