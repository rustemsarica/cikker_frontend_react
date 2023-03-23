import React, {useState, useEffect} from "react";
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
import Modal from '@mui/material/Modal';
import { useStateContext } from "../../components/contexts/ContextProvider";
import PostCard from "./PostCard";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width:{xs:'90vw', md:'50vw'},
    borderRadius:'10px',
    boxShadow: 24,
    p: 4,
};

function PostFormModal(props){
    const {username,userId,token} = useStateContext();
    const {formModalStatus, formModalClose, formModalPostId, setFormModalPostId} = props;
    
    const [textModal, setTextModal] = useState("");

    const [imagesModal, setImagesModal] = useState([]);
    const [rtPost, setRtPost] = useState(null);

    useEffect(()=>{
        if(formModalPostId!=null){
            axiosClient.get("/posts/"+ formModalPostId)
            .then(({data}) => {
                if(data!=null){
                    setRtPost(data);
                }                
            })
            .catch((err) => {
                enqueueSnackbar(err,{variant:"error"})
            })
        }
    },[formModalPostId])

    const selectedImagesModal = () => {        
        const fileInput = document.querySelector('#postModalImageSelector') ;
        if(imagesModal.length+fileInput.files.length>4){
            enqueueSnackbar("You cannot add more than 4 images.", {variant:'info'});
            fileInput.value=null;
        }else{
            if(imagesModal.length===0){
                setImagesModal(Array.from(fileInput.files));  
            }else{
                setImagesModal(imagesModal.concat(Array.from(fileInput.files)));
            }            
        }
    }

    const savePostModal=() => {
        if((textModal==="" && imagesModal.length===0 && formModalPostId==null) || token==null){
            return;
        }
        var formData = new FormData();
        formData.append('user', userId);
        formData.append('text', textModal);
        if(formModalPostId!=null){
            formData.append('rt_id', formModalPostId);
        }        
        Array.from(imagesModal).forEach(item =>{
            formData.append('images', item);
        })
        
        axiosClient.post("/posts", formData)
        .then(({data}) => {
            if(data!=null){
                setTextModal("");
                enqueueSnackbar("Post saved.",{variant:"success"});
                setFormModalPostId(null)
                formModalClose();
            }
            
        })
        .catch((error) => {
            if(error.response.status===401){
                savePostModal();
            }else{
                enqueueSnackbar(error.response.statusText,{variant:"error"})
            }
        })
    }

    if(token!=null){
        return(     
            <Modal
                open={formModalStatus}
                onClose={formModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                
                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <Avatar alt={username.charAt(0).toUpperCase()} src={"http://localhost:8080/uploads/avatars/"+userId+".webp"} sx={{ mr:2, display:{xs:'none', sm:'block'} }} />
                    
                    <Box sx={{display: 'flex', width:'100%', flexDirection: 'column'}}>
                        <TextField
                            id="outlined-multiline-static"
                            label="End of the day.."
                            multiline
                            name="text"
                            fullWidth
                            value={textModal}
                            onChange={ev => setTextModal(ev.target.value) }
                        />
                        {imagesModal && imagesModal.length>0 ? 
                        <Box sx={{ width: '100%', overflowY: 'auto'}}>
                        <ImageList variant="masonry" cols={4} gap={8} rowHeight={250}>
                            { imagesModal.map((item) => (
                                
                                <ImageListItem key={imagesModal.indexOf(item)} >
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
                                        onClick={()=>setImagesModal(imagesModal.filter(function(el){ return imagesModal.indexOf(el) !== imagesModal.indexOf(item) }))}
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
                        {rtPost!=null && formModalPostId!=null ?
                            <PostCard data={rtPost} setFormModalPostId={setFormModalPostId}></PostCard>
                        :
                        null
                        }                                
                    </Box>                    
                </Box>
                        
                <Box sx={{display:'flex', flexDirection:'row', px:0, pb:0, pt:2, alignItems:'center', justifyContent:'end'}} gap={2}>
                    <div >                    
                        <input 
                        accept="image/*" 
                        id="postModalImageSelector" 
                        type="file"                                
                        disabled={imagesModal.length>=4 ? true : false}
                        multiple={imagesModal.length<3 ? true : false} 
                        onChange={selectedImagesModal} 
                        style={{ display: 'none' }} />
                        <label htmlFor="postModalImageSelector">
                            <IconButton color="primary" aria-label="upload picture" component="span" sx={{p:0}} disabled={imagesModal.length>=4 ? true : false}>
                                <CollectionsOutlinedIcon />
                            </IconButton>
                        </label>                 
                    </div>
                    <Button onClick={savePostModal} variant="contained">Save</Button>
                </Box>
            
                </Box>
            </Modal>
        )
    }else{
        return null;
    }
    
}

export default PostFormModal;