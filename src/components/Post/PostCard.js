import React from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';

function PostCard(props){

    const { data,setFormModalPostId}=props;

    return(
        <Card sx={{ textAlign: 'left',boxShadow:'none', border:'none', mt:2 }}>
            <CardHeader
                avatar={<Avatar alt={data.username.charAt(0).toUpperCase()} src={"http://localhost:8080/uploads/avatars/"+data.userId+".webp"} />}                
                title={data.username}
                subheader={data.createdAt}
                action={<IconButton onClick={()=>setFormModalPostId(null)} ><CancelIcon></CancelIcon></IconButton>}
            />
            <CardContent sx={{py:0}}>
                {data.text!=="" || data.text!=null ?               
                    <Typography variant="body2" color="text.secondary">
                        {data.text}
                    </Typography>
                :
                    null
                }
                {data.images && data.images.length>0 ? 
                    <Box sx={{ width: '100%', overflowY: 'auto'}}>
                        <ImageList variant="masonry" cols={data.images.length} gap={8} rowHeight={250}>
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
            </CardContent>
        </Card>
    )
}

export default PostCard;