import React, {useState, useEffect, useRef} from "react";

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import InputAdornment from '@mui/material/InputAdornment';

import {  enqueueSnackbar } from 'notistack';
import axiosClient from "../../axios-client";
import { useStateContext } from "../../components/contexts/ContextProvider";
import { Box, Card, Tooltip, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconButton } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';

import { useMediaQuery } from "@mui/material";
import defaultAvatar from '../../user-128.png';
function Messages(){
    const {userId, setPageName} = useStateContext();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [active, setActive] = useState(null);
    const [message, setMessage] = useState("");
   
    const messagesEndRef = useRef(null)

    const isSmallScreen = useMediaQuery("(max-width:600px)");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth",block: "end" })
    }

    const sendMessage = () => {
        
        axiosClient.post("/messages",{
            sender_id:userId,
            receiver_id:active.receiver_id,
            text:message,
            conversation_id:active.id
        })
        .then(({data})=>{
            setMessage("");
            getMessages(active);
            }
        )
        .catch((error) => {
            if(error.response.status===401){
                sendMessage();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })
    }

    const getMessages = (item) => {
        setActive(item);
        if(isSmallScreen){
            console.log(item)
        setPageName(<div><IconButton onClick={()=>{setActive(null); setPageName("Messages")}}><ArrowBackIcon></ArrowBackIcon></IconButton>{item.receiver_id!==parseInt(userId) ? item.receiver_username : item.sender_username}</div>)
        }
        axiosClient.get("/messages/"+item.sender_id+"-"+item.receiver_id, )
        .then(({data}) => {
            setMessages(data);
            scrollToBottom();
        })
        .catch((error) => {
            if(error.response.status===401){
                getMessages();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })
        
    }

    useEffect(()=>{
        setPageName("Messages")
        const getAllMessages = ()=>{
            axiosClient.get("/messages/conversations", )
            .then(({data}) => {
                setConversations(data);
            })
            .catch((error) => {
                if(error.response.status===401){
                    getAllMessages();
                }else{
                    enqueueSnackbar(error.response.statusText,{variant:"error"})
                }
            })
        }
        getAllMessages();
    },[])

    useEffect(() => {
        scrollToBottom()
    }, [messages]);
   
    return(
        isSmallScreen ?
        (    
            active
            ?
            <div>                
                {messages.length>0 &&
                    <Card sx={{ width:'100%', height:'calc(100vh - 112px)', maxHeight:'calc(100vh - 112px)', display:'flex', flexDirection:'column', justifyContent:"space-between"}}>
                        <Box sx={{height:'auto', overflowY:'auto', px:1,pt:1}}  >
                            {messages.map(item => (
                                item.user.id===parseInt(userId) ?
                                <Box key={"message_"+messages.indexOf(item)} sx={{ width:'100%', display:'flex', justifyContent:"end", mb:1}}>
                                    <Box 
                                    component="span" sx={{ p: 2,backgroundColor: 'primary.main', borderRadius:5,display:"inline-block", overflowWrap:'anywhere' }}                         
                                    >
                                        {item.text}
                                    </Box>
                                </Box>
                                :
                                <Box key={"message_"+messages.indexOf(item)} sx={{ width:'100%', display:'flex', justifyContent:"start", mb:1}}>
                                    <Box 
                                    component="span" sx={{ p: 2, borderRadius:5,display:"inline-block", overflowWrap:'anywhere' }}
                                    bgcolor={'primary.soft'}                     
                                    >
                                        {item.text}
                                    </Box>
                                </Box>
                            ))}
                            <div ref={messagesEndRef} />
                        </Box>
                        <Box key={"message"} sx={{ display:'block', p:1}}>
                            <FormControl  fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Message..</InputLabel>
                                <OutlinedInput
                                id="outlined-adornment-static"
                                label="Message.."
                                aria-label="Message.."
                                fullWidth
                                value={message}
                                endAdornment={
                                    <InputAdornment position="end">
                                    <IconButton
                                        aria-label="send message"
                                        onClick={sendMessage}
                                        edge="end"
                                    >
                                        <ArrowForwardIcon /> 
                                    </IconButton>
                                    </InputAdornment>
                                }
                                onChange={ev => setMessage(ev.target.value) }
                                />
                            </FormControl>
                        </Box>
                    </Card>
                }
            </div>
            :
        
            <Card sx={{pt:0, height:'calc(100vh - 112px)', maxHeight:'calc(100vh - 112px)'}}>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>                                                             
                    {conversations.map(item => (           
                        <ListItemButton key={"conversation_"+conversations.indexOf(item)} onClick={()=>getMessages(item)} sx={{borderRight:active===item ? "3px solid" : "none", borderColor:active===item ? "primary.main" : "none"}}>
                            <ListItemAvatar>
                                <Avatar 
                                    alt={item.receiver_id!==parseInt(userId) ? item.receiver_username.charAt(0).toUpperCase() : item.sender_username.charAt(0).toUpperCase()} 
                                    src={item.receiver_id!==parseInt(userId) ? "http://localhost:8080/uploads/avatars/"+item.receiver_id+".webp" : "http://localhost:8080/uploads/avatars/"+item.sender_id+".webp"} sx={{ mr:2 }}  />
                            </ListItemAvatar>
                            <ListItemText primary={item.receiver_id!==parseInt(userId) ? item.receiver_username : item.sender_username}  secondary={item.lastMessage}   />
                        </ListItemButton>
                    ))}
                </List>
            </Card>
        )
        :
        (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} sx={{pt:0}}>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>                                                             
                    {conversations.map(item => (           
                        <ListItemButton key={"conversation_"+conversations.indexOf(item)} onClick={()=>getMessages(item)} sx={{borderRight:active===item ? "3px solid" : "none", borderColor:active===item ? "primary.main" : "none"}}>
                            <ListItemAvatar>
                                <Avatar 
                                    alt={item.receiver_id!==parseInt(userId) ? item.receiver_username.charAt(0).toUpperCase() : item.sender_username.charAt(0).toUpperCase()} 
                                    src={item.receiver_id!==parseInt(userId) ? "http://localhost:8080/uploads/avatars/"+item.receiver_id+".webp" : "http://localhost:8080/uploads/avatars/"+item.sender_id+".webp"} sx={{ mr:2 }} />
                            </ListItemAvatar>
                            <ListItemText primary={item.receiver_id!==parseInt(userId) ? item.receiver_username : item.sender_username}  secondary={item.lastMessage}   />
                        </ListItemButton>
                    ))}
                </List>
            </Grid>
            <Grid item xs={0} sm={6} sx={{pt:0, display:{xs:'none',sm:'block'}}}>
                {messages.length>0 &&
                    <Box sx={{ width:'100%', height:'calc(100vh - 112px)',maxHeight:'calc(100vh - 112px)', display:'flex', flexDirection:'column', justifyContent:"space-between", p:2}}>
                        <Box sx={{height:'auto', overflowY:'auto', px:1}}  >
                            {messages.map(item => (
                                item.user.id===parseInt(userId) ?
                                <Box key={"message_"+messages.indexOf(item)} sx={{ width:'100%', display:'flex', justifyContent:"end", mb:1}}>
                                    <Box 
                                    component="span" sx={{ p: 2,backgroundColor: 'primary.main', borderRadius:5,display:"inline-block", overflowWrap:'anywhere' }}                         
                                    >
                                        {item.text}
                                    </Box>
                                </Box>
                                :
                                <Box key={"message_"+messages.indexOf(item)} sx={{ width:'100%', display:'flex', justifyContent:"start", mb:1}}>
                                    <Box 
                                    component="span" sx={{ p: 2, borderRadius:5,display:"inline-block", overflowWrap:'anywhere' }}
                                    bgcolor={'primary.soft'}                     
                                    >
                                        {item.text}
                                    </Box>
                                </Box>
                            ))}
                            <div ref={messagesEndRef} />
                        </Box>
                        <Box key={"message"} sx={{ width:'100%', display:'block'}}>
                            <FormControl sx={{ m: 1, }} fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Message..</InputLabel>
                                <OutlinedInput
                                id="outlined-adornment-static"
                                label="Message.."
                                aria-label="Message.."
                                fullWidth
                                value={message}
                                endAdornment={
                                    <InputAdornment position="end">
                                    <IconButton
                                        aria-label="send message"
                                        onClick={sendMessage}
                                        edge="end"
                                    >
                                        <ArrowForwardIcon /> 
                                    </IconButton>
                                    </InputAdornment>
                                }
                                onChange={ev => setMessage(ev.target.value) }
                                />
                            </FormControl>
                        </Box>
                    </Box>
                }
            </Grid>
        </Grid>
        )
    )
};

export default Messages;