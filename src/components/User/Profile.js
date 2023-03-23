import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom"
import Post from "../Post/Post";
import PostForm from "../Post/PostForm";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../components/contexts/ContextProvider";

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Box, Divider } from "@mui/material";

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import UploadIcon from '@mui/icons-material/Upload';
import {  enqueueSnackbar } from 'notistack';
import ProfileCart from "../Partials/ProfileCart";
import Button from '@mui/material/Button';
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';

import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import Modal from '@mui/material/Modal';
import Loading from "../Partials/Loading";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 80,
    width:80,
    '&:hover, &.Mui-focusVisible': {
      zIndex: 1,
      '& .MuiImageBackdrop-root': {
        opacity: 0.15,
      },
      '& .MuiImageMarked-root': {
        opacity: 0,
      },      
    },
  }));
  
  const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
    borderRadius:64
  });
  
  const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
    borderRadius:64
  }));
  
  const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
    borderRadius:64
  }));
  

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 0 }} component='div'>
            {children}
          </Box>
        )}
      </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
  
function a11yProps(index) {
        return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
        };
}

function Profile(props){
    const {userId,setPageName} = useStateContext();
    const {username} = useParams();
    
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [likeds, setLikeds] = useState([]);
    const [user, setUser] = useState(null);
    const [edit, setEdit] = useState(false);

    const {tab,refreshPosts}=props;

    useEffect(()=>{
        const getUserInfo = ()=>{
            axiosClient.get("/users/username/"+username)       
            .then(({data})=>{
                    setIsLoaded(true);
                    if(data.user==null){
                        setError("User not found!")
                    }else{
                        setPosts(data.posts);
                        setUser(data.user);
                        console.log(data.user)
                        setFollowers(data.followers);
                        setFollowings(data.followings);
                        setLikeds(data.likes);
                        setPageName(username);
                    }                    
                })
            .catch((error) => {
                if(error.response.status===401){
                    getUserInfo();
                }else{
                    setIsLoaded(true)
                    enqueueSnackbar(error.response.statusText,{variant:"error"})
                    setPageName(username);
                    setError("User not found!")
                }
            })
        }
        getUserInfo();
    },[username])


    const [value, setValue] = useState(tab ? tab : 0);
    
    const sleep = async (milliseconds) => {
        await new Promise(resolve => {
            return setTimeout(resolve, milliseconds)
        });
    };

    const onUpload = ()=>{
        
        const fileInput = document.querySelector('#editProfilePicture') ;
        var formData = new FormData();
        formData.append('file', fileInput.files[0]);

        axiosClient.put("/users/"+userId+"/avatar",formData)
        .then(async ({data})=>{
            sleep(2000)
            enqueueSnackbar(data.message,{variant:data.status})
        })
        .catch((error) => {
            if(error.response.status===401){
                onUpload();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })

    }

    const editProfile = () => {
        setEdit(true);
    }

    const follow = () => {
        var body = {
            userId : userId,
            followId: user.id
          };
        axiosClient.post("/follows",body)
        .then(()=>user.followed=true)
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
            followId: user.id
        };
        axiosClient.post("/follows/unfollow",body)
        .then(()=>user.followed=false)
        .catch((error) => {
            if(error.response.status===401){
                unfollow();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })
    }

    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState(null);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setMessage(null);
        setOpen(false);
    };

    const sendMessageModal=()=>{
        handleOpen();
    }

    const sendMessage = () => {
        axiosClient.post("/messages",{
            sender_id:userId,
            receiver_id:user.id,
            text:message
        })
        .then(()=>{
            handleClose();
        })
        .catch((error) => {
            if(error.response.status===401){
                sendMessage();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })
    }

    if(!isLoaded){
        return (
            <Loading></Loading>
        )    
    }else if(error){
        return(
            <div>{error.response.status}</div>
        )
    }else{
        return(
                <div style={{marginBottom:{xs:"56px",md:'5px'}}}>
                    <Card sx={{ textAlign: 'left', borderRadius:0 }}>
                        <CardHeader
                            avatar={
                                edit ?                                    
                                    <ImageButton                                                
                                        key={user.id}
                                        component="label"
                                        style={{
                                            width: 80,
                                            height:80,
                                            borderRadius:64,
                                        }}
                                    >                                                
                                        <ImageSrc style={{ backgroundImage: 'url(http://localhost:8080/uploads/avatars/'+user.id+'.webp)' }} />
                                        <ImageBackdrop className="MuiImageBackdrop-root" />
                                        <Image>
                                            <input accept="image/*" id="editProfilePicture" type="file" onChange={onUpload} hidden /> 
                                            <UploadIcon />
                                        </Image>                                   
                                    </ImageButton>
                                :
                                    <Avatar alt={user.username.charAt(0).toUpperCase()} src={"http://localhost:8080/uploads/avatars/"+user.id+".webp"} sx={{ width: 80, height: 80 }} />
                            }
                            title={<Typography
                                variant="h6"
                                noWrap
                                component="a"
                                sx={{
                                mr: 2,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                                }}
                            >{user.username}
                            </Typography>}
                            action={
                                parseInt(user.id) === parseInt(userId )?
                                edit ?
                                <IconButton aria-label="cancel" onClick={()=>setEdit(false)} >
                                    <CancelIcon />
                                </IconButton>
                                :
                                <Button onClick={editProfile} variant="outlined" startIcon={<EditIcon />}>
                                    Edit
                                </Button>
                                :
                                user.followed ? 
                                <Button onClick={unfollow} variant="outlined" startIcon={<PersonRemoveAlt1Icon />}>
                                    Unfollow
                                </Button>
                                :
                                <div>
                                <Button onClick={follow} variant="outlined" startIcon={<PersonAddAlt1Icon />}>
                                    Follow
                                </Button>
                                <Button onClick={sendMessageModal} variant="outlined" startIcon={<EditIcon />}>
                                    msg
                                </Button>
                                </div>
                            }
                                        
                        />
                        <CardContent sx={{p:0,'&:last-child':{pb:0}, justifyContent:'space-around'}} >
                            {edit ?
                                <div style={{display:"flex", flexDirection:"column"}}>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Bio.."
                                        multiline
                                        fullWidth
                                        value={user.info==null ? "" : user.info}
                                    />
                                    <Button sx={{mt:1}} variant="contained">Save</Button>
                                </div>
                            :
                                <Typography>{user.info}</Typography>
                            }
                            <Tabs value={value} variant="scrollable" scrollButtons allowScrollButtonsMobile sx={{maxWidth:'100vw', overflowX:'auto'}}>
                                <Tab label="CikCik" href={"/"+user.username} {...a11yProps(0)} />
                                <Tab label="Likes" href={"/"+user.username+"/likes"} {...a11yProps(1)} />
                                <Tab label="Followers" href={"/"+user.username+"/followers"} {...a11yProps(2)} />
                                <Tab label="Followings" href={"/"+user.username+"/followings"} {...a11yProps(3)} />
                            </Tabs>
                        </CardContent>           
                    </Card>
                    <TabPanel value={value} index={0} sx={{p:0}}>
                        <div>
                            <Divider sx={{color:'lightskyblue', height:'5px', border:'none', boxShadow:'none'}}></Divider>
                            {parseInt(user.id) === parseInt(userId) ?
                            <PostForm refreshPosts={refreshPosts} sx={{mb:2}}></PostForm>  
                            : null
                            }
                                                          
                            {posts.map(item => (
                                <div key={"post_"+posts.indexOf(item)}>
                                    <Divider sx={{color:'lightskyblue', height:'5px', border:'none', boxShadow:'none'}}></Divider>                
                                    <Post data={item} refreshPosts={refreshPosts} sx={{mb:2}}></Post>
                                </div>         
                            ))}
                        </div> 
                    </TabPanel>
                    <TabPanel value={value} index={1} sx={{p:0}}>
                        <div>                               
                            {likeds.map(item => (
                                <div key={"likes_"+likeds.indexOf(item)}>
                                    <Divider sx={{color:'lightskyblue', height:'5px', border:'none', boxShadow:'none'}}></Divider>                
                                    <Post data={item} refreshPosts={refreshPosts} sx={{mb:2}}></Post>
                                </div>         
                            ))}
                        </div> 
                    </TabPanel>
                    <TabPanel value={value} index={2} sx={{p:0}}>
                        <div>                               
                            {followers.map(item => (
                                <div key={"follower_"+likeds.indexOf(item)}>
                                    <Divider sx={{color:'lightskyblue', height:'5px', border:'none', boxShadow:'none'}}></Divider>
                                    <ProfileCart data={item}  userId={userId}></ProfileCart>
                                </div>         
                            ))}
                        </div> 
                    </TabPanel>
                    <TabPanel value={value} index={3} sx={{p:0}}>
                        <div>                               
                            {followings.map(item => (
                                <div key={"following_"+item.id}>
                                    <Divider sx={{color:'lightskyblue', height:'5px', border:'none', boxShadow:'none'}}></Divider>                
                                    <ProfileCart data={item} userId={userId}></ProfileCart>
                                </div>         
                            ))}
                        </div>
                    </TabPanel>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                        <TextField
                                id="outlined-multiline-static"
                                label="End of the day.."
                                multiline
                                fullWidth
                                value={message}
                                onChange={ev => setMessage(ev.target.value) }
                            />
                            <Button onClick={sendMessage}>Send</Button>
                        </Box>
                    </Modal>
                </div>
        )
    }
}

export default Profile;