import { Button, CardContent, InputAdornment, OutlinedInput } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { PostWithAuth } from "../../services/HttpService";

function CommentForm(props) {
    const {userId, userName, postId, setRefresh} = props;
    const [text, setText] = useState("");
    const [isSent, setIsSent] = useState(false);

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
        .then((res) => res.json())
        .catch((err) => console.log("error"))
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
            <Avatar sx={{ background: 'linear-gradient(45deg, #2196F3, 30%, #21CBF3 90%)', color: 'white' }} aria-label="recipe">
              {userName.charAt(0).toUpperCase()}
            </Avatar>
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