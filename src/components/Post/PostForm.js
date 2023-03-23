import React, {useState} from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {  enqueueSnackbar } from 'notistack';
import axiosClient from "../../axios-client";
import { IconButton } from "@mui/material";
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import { useStateContext } from "../../components/contexts/ContextProvider";

function PostForm(props){
    const {username,userId,token} = useStateContext();
    const {refreshPosts} = props;
    const [text, setText] = useState("");

    const [images, setImages] = useState([]);

    const selectedImages = ()=>{        
        const fileInput = document.querySelector('#postImageSelector') ;
        if(images.length+fileInput.files.length>4){
            enqueueSnackbar("You cannot add more than 4 images.", {variant:'info'});
            fileInput.value=null;
        }else{
            if(images.length===0){
                setImages(Array.from(fileInput.files));  
            }else{
                setImages(images.concat(Array.from(fileInput.files)));

            }
            
        }
    }

    const savePost=() => {
        if((text==="" && images.length===0) || token==null){
            return;
        }
        var formData = new FormData();
        formData.append('user', userId);
        formData.append('text', text);
        Array.from(images).forEach(item =>{
            formData.append('images', item);
        })
        
        axiosClient.post("/posts", formData)
        .then(({data}) => {
            if(data!=null){
                setText("");
                setImages([]);
                refreshPosts();
                enqueueSnackbar("Post saved.",{variant:"success"});
            }
            
        })
        .catch((error) => {
            if(error.response.status===401){
                savePost();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })
    }

    if(token!=null){
        return(     
            <div>  
                <Card sx={{ textAlign: 'left',boxShadow:'none', border:'none',borderRadius:0,  borderLeft:'2px solid', borderRight:'2px solid', borderColor:'primary.soft' }}>
                    <CardContent>
                        <Box sx={{display: 'flex', flexDirection: 'row'}}>
                            <Avatar alt={username.charAt(0).toUpperCase()} src={"http://localhost:8080/uploads/avatars/"+userId+".webp"} sx={{ mr:2 }} />
                            
                            <Box sx={{display: 'flex', width:'100%', flexDirection: 'column'}}>
                                <TextField
                                id="outlined-multiline-static"
                                label="End of the day.."
                                multiline
                                fullWidth
                                value={text}
                                onChange={ev => setText(ev.target.value) }
                                />

                                {images && images.length>0 ? 
                                <Box sx={{ width: '100%', overflowY: 'auto'}}>
                                <ImageList variant="masonry" cols={4} gap={8} rowHeight={250}>
                                    { images.map((item) => (
                                        
                                        <ImageListItem key={images.indexOf(item)} >
                                            <img
                                                src={URL.createObjectURL(item)}
                                                srcSet={URL.createObjectURL(item)}
                                                sx={{width:248,height:300, objectFit:'cover'}}
                                                alt={item.name}
                                                loading="lazy"
                                            />
                                            <ImageListItemBar
                                            sx={{
                                                background:
                                                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                            }}
                                            position="top"
                                            actionIcon={
                                                <IconButton
                                                sx={{ color: 'white' }}
                                                onClick={()=>setImages(images.filter(function(el){ return images.indexOf(el) !== images.indexOf(item) }))}
                                                >
                                                <CancelRoundedIcon />
                                                </IconButton>
                                            }
                                            actionPosition="left"
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                                </Box> : null}                                
                            </Box>                           
                            
                        </Box>
                        
                        <Box sx={{display:'flex', flexDirection:'row', px:0, pb:0, pt:2, alignItems:'center', justifyContent:'end'}} gap={2}>
                            <div >                    
                                <input 
                                accept="image/*" 
                                id="postImageSelector" 
                                type="file"                                
                                disabled={images.length>=4 ? true : false}
                                multiple={images.length<3 ? true : false} 
                                onChange={selectedImages} 
                                style={{ display: 'none' }} />
                                <label htmlFor="postImageSelector">
                                    <IconButton color="primary" aria-label="upload picture" component="span" sx={{p:0}} disabled={images.length>=4 ? true : false}>
                                        <CollectionsOutlinedIcon />
                                    </IconButton>
                                </label>                 
                            </div>
                            <Button onClick={savePost} variant="contained">Save</Button>
                        </Box>
                    </CardContent>
                </Card>      
            </div> 
        )
    }else{
        return null;
    }
    
}

export default PostForm;