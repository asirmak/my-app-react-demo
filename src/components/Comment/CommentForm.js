import { Button, CardContent, InputAdornment, OutlinedInput } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { PostWithAuth, RefreshToken } from "../../services/HttpService";

function CommentForm(props) {
    const {userId, postId, setRefresh, avatarId} = props;
    const [text, setText] = useState("");
    const [isSent, setIsSent] = useState(false);
    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("username");
        localStorage.removeItem("refreshKey");
        localStorage.removeItem("avatarId");
        navigate(0)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setIsSent(false);
      };

    const saveComment = () => {
        PostWithAuth("/comments", {
            userId: localStorage.getItem("currentUser"),
            postId: postId,
            text: text,
        })
        .then((res) => {
            if(!res.ok){
                RefreshToken()
                .then((res) => {if(!res.ok){
                        logout();
                    } else {
                        return res.json();
                    }    
                })
                .then((result) => {
                    if (result !== undefined){
                        localStorage.setItem("tokenKey", result.accessToken);
                        saveComment();
                        setRefresh(true);
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
            }
            else {
                res.json()
            } 
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const handleSubmit = () => {
        if (text !== ""){
            saveComment();
            setIsSent(true);
            setText("");
            setRefresh(true);
        }
    }

    const handleText = (value) => {
        setText(value);
        setIsSent(false);
    }

    return(
        <div>
        <Snackbar open={isSent} autoHideDuration={3000} onClose={handleClose} anchorOrigin={ {vertical : 'bottom', horizontal:'center'}}>
        <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
        >
            Comment is sent successfully
        </Alert>
        </Snackbar>
        <CardContent sx={ {display: "flex", flexWrap: "wrap", justifyContent : "flex-start", alignItems : "center"} }>
        <OutlinedInput
        id="outlined-adornment-amount"
        multiline
        inputProps={{maxLength : 250}}
        fullWidth
        value={text}
        placeholder="Type here..."
        startAdornment = {
            <InputAdornment position = "start">
                <Link to={{ pathname: '/users/' + userId }} style={{ color: 'white', textDecoration: 'none', boxShadow: 'none' }}>
                    <Avatar src={`/avatars/avatar${avatarId}.png`}/>
                </Link>
            </InputAdornment>
        }
        style={ {color: "black", backgroundColor: "white"}}
        onChange={ (i) => handleText(i.target.value)}
        endAdornment = {
            <InputAdornment position = "end">
            <Button 
            variant = "contained"
            style= {{background: 'linear-gradient(45deg, #2196F3, 30%, #21CBF3 90%)',
                color: 'white',
            }}
            onClick={handleSubmit}
            >Comment
            </Button>
            </InputAdornment>
        }
        >
        </OutlinedInput>
        </CardContent>
        </div>
    );

}

export default CommentForm;