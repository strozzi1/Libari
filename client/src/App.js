
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Routes, Route} from 'react-router-dom'
import HomePage from './scenes/homePage';
import LoginPage from './scenes/loginPage';
import ProfilePage from './scenes/profilePage';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import ListPage from './scenes/listPage';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { REACT_APP_GOOGLE_CLIENT_ID } from './env';

function App() {
  const mode = useSelector((state) => state.auth.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuthed = Boolean(useSelector((state)=> state.auth.token))
  
  return (
    <div className="app">
      <GoogleOAuthProvider clientId={`${REACT_APP_GOOGLE_CLIENT_ID}`}> 
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/' element={!isAuthed ? <LoginPage/> : <HomePage/>}/>
            <Route 
              path='/home' 
              element={isAuthed ? <HomePage/> : <Navigate to="/" />}
            />
            <Route 
              path='/user/:username' 
              element={<ProfilePage/>}
            />
            <Route
              path='/user/:username/list'
              element={<ListPage/>}
              />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
