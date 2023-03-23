import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Profile from './components/User/Profile';
import { ThemeProvider , createTheme } from '@mui/material/styles';

import Header from "./components/Partials/Header";
import RightSidebar from "./components/Partials/RightSidebar";
import LeftSidebar from "./components/Partials/LeftSidebar";
import { Box, Container } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { useStateContext } from "./components/contexts/ContextProvider";
import Settings from './components/Settings/Settings';
import BottomNav from './components/Partials/BottomNav';
import PostFormModal from './components/Post/PostFormModal';
import Messages from './components/Message/Messages';
import Search from './components/Home/Search';


const theme = createTheme({
  palette: {
    background: {
      default: "#e76097"
    },
    mode: 'light',
    common:{
      black:'#000',
      white: '#fff'
    },
    primary: {
      main: '#e0196a',
      soft:'#e76097',
      dark:'#b91660'
    },
    action:{
      disabled:'#e76097'
    }
    
  }
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    common:{
      black:'#000',
      white: '#fff'
    },
    primary: {
      main: '#e0196a',
      soft:'#e76097',
      dark:'#b91660'
    },
    action:{
      disabled:'#e76097'
    }
  },
});

function App() {
  const {token,themeMode} = useStateContext();

  const [formModalStatus, setFormModalStatus] = React.useState(false);
  const [formModalPostId, setFormModalPostId] = React.useState(null);
  const formModalOpen = () => {
    setFormModalStatus(true); 
  }
  const formModalClose = () => {
    setFormModalStatus(false); 
    setFormModalPostId(null);
  }


  return (
    <div className="App" style={{paddingBottom:0}}>
      <ThemeProvider  theme={themeMode==='light' ? theme : darkTheme}>
      <CssBaseline />
      
      <Container maxWidth="xl" sx={{display:'flex', flexDirection:'row', px:{xs:0, md:1}}}>
        <Box component="div" className="sidebar" sx={{ display: { xs: "none", lg: 'block' } }}>
            <div className="fixed">
                <LeftSidebar formModalStatus={formModalStatus} formModalOpen={formModalOpen}></LeftSidebar>
            </div>
        </Box>
        <div className="main-content" style={{ marginBottom:{xs:'60px', md:'10px'}}}>
            <Header></Header>
            
            <div style={{ verticalAlign:'middle' }}>
              <BrowserRouter>
                <Routes>
                  <Route exact path='/' element={token == null ? <Navigate to="/auth/login"/> : <Home formModalStatus={formModalStatus} formModalOpen={formModalOpen} formModalPostId={formModalPostId} setFormModalPostId ={setFormModalPostId} />}></Route>
                  <Route exact path='/search' element={<Search formModalStatus={formModalStatus} formModalOpen={formModalOpen} formModalPostId={formModalPostId} setFormModalPostId ={setFormModalPostId} />}></Route>
                  <Route exact path='/messages' element={ <Messages/> }></Route>
                  <Route exact path='/settings' element={<Settings></Settings>}></Route>
                  <Route exact path='/auth/register' element={token != null ? <Navigate to="/"/> : <Register/>}></Route>
                  <Route exact path='/auth/login' element={token != null ? <Navigate to="/"/> : <Login/>}></Route>

                  <Route exact path='/:username' element={token != null ? <Profile/> : <Navigate to="/auth/login"/> }></Route>
                  <Route exact path='/:username/likes' element={token != null ? <Profile tab={1} /> : <Navigate to="/auth/login"/> }></Route>
                  <Route exact path='/:username/followers' element={token != null ? <Profile tab={2} /> : <Navigate to="/auth/login"/> }></Route>
                  <Route exact path='/:username/followings' element={token != null ? <Profile tab={3} /> : <Navigate to="/auth/login"/> }></Route>
                </Routes>      
              </BrowserRouter>               
            </div>
        </div>
        <Box component="div" className="sidebar" sx={{ display: { xs: 'none', lg: 'block' } }}>
            <div className="fixed">
                <RightSidebar></RightSidebar>
            </div>
        </Box>               
          
      </Container>
      <BottomNav formModalStatus={formModalStatus} formModalOpen={formModalOpen}></BottomNav>

      <PostFormModal  
        formModalClose={formModalClose} 
        formModalStatus={formModalStatus} 
        formModalPostId={formModalPostId} 
        setFormModalPostId={setFormModalPostId}
      ></PostFormModal>

      </ThemeProvider >
    </div>
  );
}

export default App;
