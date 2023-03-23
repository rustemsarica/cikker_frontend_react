import React, {useEffect, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Box, Divider } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import axiosClient from '../../axios-client';

import { TextField, InputAdornment, IconButton, ListItemButton } from "@mui/material";
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import TagIcon from '@mui/icons-material/Tag';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useStateContext } from '../contexts/ContextProvider';

export default function RightSidebar(){
    const {userId}=useStateContext();
    const [trends,setTrends] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [suggestUsers, setSuggestUsers] = useState([]);

    const handleSearchChange = (event) => {
      const value = event.target.value;
      console.log(value)
      setSearchTerm(value);
      if(value.length<2){
        setSearchResults([]);
        return null;
      }
      if(value.charAt(0)==='#'){
        performSearch(value.substring(1));
        return
      }
      performSearch(value);
    };

    const performSearch = (val) => {
      
      axiosClient.get('/search/'+val)
      .then((data)=>{               
        setSearchResults(data.data);        
      })
      
    };

    const getTrends = () =>{
      axiosClient.get('/posts/trends')
        .then((data)=>{
          setTrends(data.data);
        })
    }

    const getSuggestUsers = () =>{
      axiosClient.get('/follows/'+userId+"/suggests")
        .then((data)=>{
          setSuggestUsers(data.data);
        })
    }
   
    useEffect(()=>{
      if(trends.length===0){
        getTrends();
      }else{
        const interval = setInterval(() => {
          getTrends();
        }, 300000);
        return () => clearInterval(interval);
      }
      getSuggestUsers();
      
      
    }, [])

    return ( 
            <Card sx={{ textAlign: 'left', height:'100vh', borderRadius:0, boxShadow:'none',}}>
                <CardContent sx={{pt:0}}>            
                    <nav>
                        <Box sx={{display:'flex', flexDirection:'row', alignItems:'center', px:2, py:2}}>
                          <div>
                            <TextField
                              label="Search.."
                              variant="outlined"
                              fullWidth
                              value={searchTerm}
                              onChange={handleSearchChange}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">                                  
                                      <SearchIcon />
                                  </InputAdornment>
                                )
                              }}
                            />
                            {searchResults.length > 0 && (
                              <List>
                                {searchResults.map((result) => (
                                  <ListItem key={result.id}>
                                    <ListItemButton href={ result.type==='user' ? "/"+result.title : "/search?q="+result.title}>
                                      <ListItemIcon>
                                        {result.type==='user' ?
                                          <Avatar alt={result.title.charAt(0).toUpperCase()} src={"http://localhost:8080/uploads/avatars/"+result.id+".webp"} />
                                        :
                                          <TagIcon></TagIcon>
                                        }                                      
                                      </ListItemIcon>
                                      <ListItemText primary={result.title} />
                                    </ListItemButton>
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </div>  
                                                                          
                        </Box>
                         <Divider />                     
                        {trends.length>0 &&
                          <div>
                            <Toolbar>          
                                <Typography variant="h6" noWrap component="div">
                                  Trends
                                </Typography>
                            </Toolbar> 
                            <Divider />
                            <List>                              
                                {trends.map(tag=>(
                                  <ListItem disablePadding key={tag}>
                                      <ListItemButton href={ "/search?q="+tag}>
                                        <ListItemIcon sx={{minWidth:'auto'}}>
                                            <TagIcon></TagIcon>                       
                                        </ListItemIcon>
                                        <ListItemText primary={tag} />
                                      </ListItemButton>
                                  </ListItem>
                                ))}
                            </List>
                          </div> 
                        }
                        
                        {suggestUsers.length>0 &&
                          <div>
                            <Toolbar>          
                                <Typography variant="h6" noWrap component="div">
                                  Who to follow
                                </Typography>
                            </Toolbar>                         
                            <Divider />
                            <List>                            
                                {suggestUsers.map(user=>(
                                  <ListItem disablePadding key={user.id}>
                                      <ListItemButton href={ "/"+user.username}>
                                        <Avatar alt={user.username.charAt(0).toUpperCase()} src={"http://localhost:8080/uploads/avatars/"+user.id+".webp"} sx={{mr:2}} />
                                        <ListItemText primary={user.username} />
                                      </ListItemButton>
                                  </ListItem>
                                ))}
                            </List>
                          </div>  
                        }
                    </nav>
                
                </CardContent>                
                
            </Card>
    );
}