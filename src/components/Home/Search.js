import React, {useState, useEffect} from "react";
import { useLocation } from 'react-router-dom';
import Post from "../Post/Post";
import axiosClient from "../../axios-client";
import { Divider } from "@mui/material";
import { useStateContext } from "../contexts/ContextProvider";
import Loading from "../Partials/Loading";

function Search(props){
    const {setPageName} = useStateContext();
    const { formModalStatus, formModalOpen,  setFormModalPostId} = props;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [posts, setPosts] = useState([]);

    const location = useLocation()
    const params = new URLSearchParams(location.search)

    const refreshPosts = () => {
        if(params.get("q").length>0){
            axiosClient.get("/search?q="+params.get("q"))
            .then(
                ({data})=>{
                    setIsLoaded(true);
                    setPosts(data);
                },
                (error)=>{
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }else{
            axiosClient.get("/posts")
            .then(
                ({data})=>{
                    setIsLoaded(true);
                    setPosts(data);
                },
                (error)=>{
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }
        
    }
    
    useEffect(()=>{
        setPageName("Search");
        refreshPosts();
    },[])

        if(error){
            return (
                <div> error</div>
            )
        }else if(!isLoaded){
            return (
                <Loading></Loading>
            )            
        }else{
            return(            
                <div>                                          
                    {posts.map(item => (
                        <div key={"post_"+posts.indexOf(item)}>              
                            <Post formModalStatus={formModalStatus} formModalOpen={formModalOpen} setFormModalPostId={setFormModalPostId} data={item} refreshPosts={refreshPosts} sx={{mb:2}}></Post>
                            <Divider sx={{color:'lightskyblue', height:'5px', border:'none', boxShadow:'none'}}></Divider>  

                        </div>         
                    ))}
                </div>                       
            )
        }
        
    
}

export default Search;