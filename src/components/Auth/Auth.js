import { Button, FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
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
            localStorage.setItem("tokenKey", result.message);
            localStorage.setItem("currentUser", result.userId);
            localStorage.setItem("userName", username);
            setUsername(""); // Clear username state
            setPassword(""); // Clear password state
            navigate(0); // Reload the page
        })
        .catch((err) => console.log(err));
    }

    return (
        <FormControl>
            <InputLabel style={{ top: 10 }}>Username</InputLabel>
            <Input
                style={{ top: 5 }}
                value={username}
                onChange={handleUsername}
            />
            <InputLabel style={{ top: 75 }}>Password</InputLabel>
            <Input
                style={{ top: 25 }}
                type="password"
                value={password}
                onChange={handlePassword}
            />
            <Button
                variant="contained"
                style={{
                    marginTop: 60,
                    background: 'linear-gradient(45deg, #2196F3, 30%, #21CBF3 90%)',
                    color: 'white'
                }}
                onClick={() => handleButton("register")}
            >
                Register
            </Button>
            <FormHelperText style={{ margin: 20 }}>Are you already registered?</FormHelperText>
            <Button
                variant="contained"
                style={{
                    background: 'linear-gradient(45deg, #2196F3, 30%, #21CBF3 90%)',
                    color: 'white'
                }}
                onClick={() => handleButton("login")}
            >
                Login
            </Button>
        </FormControl>
    );
}

export default Auth;
