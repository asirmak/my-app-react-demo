import { Button, FormControl, FormHelperText, Input, InputLabel, Box } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    const handleUsername = (event) => {
        setUsername(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleButton = (path) => {
        sendRequest(path);
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
                localStorage.setItem("tokenKey", result.message);
                localStorage.setItem("currentUser", result.userId);
                localStorage.setItem("userName", username);
            }
            setUsername(""); // Clear username state
            setPassword(""); // Clear password state
            navigate(0); // Reload the page
        })
        .catch((err) => console.log(err));
    }

    return (
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
    );
}

export default Auth;
