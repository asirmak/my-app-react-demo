import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { Button, InputAdornment, OutlinedInput } from '@mui/material';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { PostWithAuth, RefreshToken } from '../../services/HttpService';

function PostForm(props) {
  const {userId, refreshPosts, avatarId} = props;
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
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

  const savePost = () => {
    return PostWithAuth("/posts", {
      title: title,
      userId: localStorage.getItem("currentUser"),
      text: text,
    })
    .then((res) => {
      if(!res.ok){
        RefreshToken()
        .then((res) => {
          if(!res.ok){
            logout();
          } else{
            return res.json();
          }
        })
        .then((result) => {
          if(result !== undefined){
            localStorage.setItem("tokenKey", result.accessToken);
            savePost();
            refreshPosts(true);
          }
        })
        .catch((err) => {
          console.log(err)
        })
      }
      else{
        res.json()
      }  
    })
    .catch((err) => console.log(err))
  }


  const handleSubmit = () => {
    if(text !== "" && title !== ""){
      savePost().then( () => {
        setIsSent(true);
        setTitle("");
        setText("");
        refreshPosts(true);
      })
    }
  }

  const handleTitle = (value) => {
    setTitle(value);
    setIsSent(false);
  }

  const handleText = (value) => {
    setText(value);
    setIsSent(false);
  }

  return (
    <div>
        <Snackbar open={isSent} autoHideDuration={3000} onClose={handleClose} anchorOrigin={ {vertical : 'bottom', horizontal:'center'}}>
        <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
        >
            Posted Successfully
        </Alert>
        </Snackbar>
    <Card sx={{ width: 800, textAlign:"left", margin: 3}} className="postContainer">
      <CardHeader
        avatar={
          <Link to={{ pathname: '/users/' + userId }} style={{ color: 'white', textDecoration: 'none', boxShadow: 'none' }}>       
            <Avatar src={`/avatars/avatar${avatarId}.png`}/>
          </Link>
        }
        title={<OutlinedInput
        id="outlined-adornment-amount"
        multiline
        placeholder='Title'
        inputProps={{maxLength : 25}}
        fullWidth
        value={title}
        onChange={ (i) => handleTitle( i.target.value) }
        > 
        </OutlinedInput>}
      />
      <CardContent>
        <div>
        <OutlinedInput
            id="outlined-adornment-amount"
            multiline
            placeholder='Text'
            inputProps={{maxLength : 250}}
            fullWidth
            value={text}
            onChange={ (i) => handleText(i.target.value)}
            endAdornment = {
                <InputAdornment position = "end">
                <Button 
                variant = "contained"
                style= {{background: 'linear-gradient(45deg, #2196F3, 30%, #21CBF3 90%)',
                    color: 'white',
                }}
                onClick={handleSubmit}
                >Post
                </Button>
                </InputAdornment>
            }
            > 
        </OutlinedInput>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

export default PostForm;
