import { Button, FormControl, FormHelperText, Input, InputLabel, Box, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    let navigate = useNavigate();

    const handleCloseLogin = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setIsLoggedIn(false);
    };

    const handleCloseRegister = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setIsRegistered(false);
    };

    const handleUsername = (event) => {
        setUsername(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleButton = (path) => {
        sendRequest(path);
        if(path === "login") setIsLoggedIn(true);
        else if(path === "register") setIsRegistered(true);
    }

    const sendRequest = (path) => {
        fetch("/auth/" + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
        .then((res) => res.json())
        .then((result) => {
            if(path === "login"){
                localStorage.setItem("tokenKey", result.accessToken);
                localStorage.setItem("refreshKey", result.refreshToken);
                localStorage.setItem("currentUser", result.userId);
                localStorage.setItem("userName", username);
                localStorage.setItem("avatarId", result.avatarId);
            }
            setUsername(""); // Clear username state
            setPassword(""); // Clear password state
            navigate(0); // Reload the page

            
        })
        .catch((err) => console.log(err));
    }

    return (
        <div>
        <Snackbar open={isLoggedIn} autoHideDuration={3000} onClose={handleCloseLogin} anchorOrigin={ {vertical : 'bottom', horizontal:'center'}}>
            <Alert
                onClose={handleCloseLogin}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}>
                Logged in successfully
            </Alert>
        </Snackbar>
        <Snackbar open={isRegistered} autoHideDuration={3000} onClose={handleCloseRegister} anchorOrigin={ {vertical : 'bottom', horizontal:'center'}}>
            <Alert
                onClose={handleCloseRegister}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}>
                Registered successfully
            </Alert>
        </Snackbar> 
        <Box component="form" noValidate autoComplete="off" sx={{ width: '100%', maxWidth: 360, mx: 'auto', mt: 10 }}>
            <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                    id="username"
                    value={username}
                    onChange={handleUsername}
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePassword}
                />
            </FormControl>
            <Button
                fullWidth
                variant="contained"
                sx={{
                    mt: 3,
                    background: 'linear-gradient(45deg, #2196F3, 30%, #21CBF3 90%)',
                    color: 'white'
                }}
                onClick={() => handleButton("register")}
            >
                Register
            </Button>
            <FormHelperText sx={{ mt: 2, textAlign: 'center' }}>Are you already registered?</FormHelperText>
            <Button
                fullWidth
                variant="contained"
                sx={{
                    mt: 1,
                    background: 'linear-gradient(45deg, #2196F3, 30%, #21CBF3 90%)',
                    color: 'white'
                }}
                onClick={() => handleButton("login")}
            >
                Login
            </Button>
        </Box>
        </div>
    );
}

export default Auth;
