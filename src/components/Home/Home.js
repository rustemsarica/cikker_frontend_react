import React, {useState, useEffect} from "react";
import Post from "../Post/Post";
import PostForm from "../Post/PostForm";
import axiosClient from "../../axios-client";
import { Divider } from "@mui/material";
import { useStateContext } from "../contexts/ContextProvider";
import Loading from "../Partials/Loading";

function Home(props){
    const {setPageName} = useStateContext();
    const { formModalStatus, formModalOpen,  setFormModalPostId} = props;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [posts, setPosts] = useState([]);

    const refreshPosts = () => {
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
    
    useEffect(()=>{
        setPageName("Home");
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
                <div style={{marginBottom:{xs:"56px",md:'5px'}}}>
                    <PostForm refreshPosts={refreshPosts} sx={{mb:2}}></PostForm>                                             
                    {posts.map(item => (
                        <div key={"post_"+posts.indexOf(item)}>
                            <Divider sx={{color:'lightskyblue', height:'5px', border:'none', boxShadow:'none'}}></Divider>                
                            <Post formModalStatus={formModalStatus} formModalOpen={formModalOpen} setFormModalPostId={setFormModalPostId} data={item} refreshPosts={refreshPosts} sx={{mb:2}}></Post>

                        </div>         
                    ))}
                </div>                       
            )
        }
        
    
}

export default Home;