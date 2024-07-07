import React from "react";
import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";
import LockOpenIcon from '@mui/icons-material/LockOpen';

function NavBar() {

    let navigate = useNavigate();

    const onClick = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("username");
        localStorage.removeItem("refreshKey")
        navigate(0)
    }

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/" style={{ color: 'white', textDecoration: 'none', boxShadow: 'none' }}>
                                Home
                            </Link>
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                            {localStorage.getItem("currentUser") === null ? <Link to="/auth" style={{ color: 'white', textDecoration: 'none', boxShadow: 'none' }}>Login/Register</Link> :
                            <div>
                                <IconButton 
                                            style={{ color: 'white', textDecoration: 'none', boxShadow: 'none' }} 
                                            onClick={onClick}> 
                                            <LockOpenIcon></LockOpenIcon>
                                </IconButton>
                                    <Link to={{ pathname: '/users/' + localStorage.getItem("currentUser") }} style={{ color: 'white', textDecoration: 'none', boxShadow: 'none' }}>
                                        Profile
                                    </Link>
                            </div>}
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    );
}

export default NavBar;
