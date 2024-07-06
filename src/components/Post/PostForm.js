import React from 'react';
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Button, InputAdornment, OutlinedInput } from '@mui/material';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { PostWithAuth } from '../../services/HttpService';

function PostForm(props) {
  const {userId, userName, refreshPosts} = props;
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSent(false);
  };

  const savePost = () => {
    PostWithAuth("/posts", {
      title: title,
      userId: localStorage.getItem("currentUser"),
      text: text,
    })
    .then((res) => res.json())
    .catch((err) => console.log("error"))
  }


  const handleSubmit = () => {
    if(text !== "" && title !== ""){
      savePost();
      setIsSent(true);
      setTitle("");
      setText("");
      refreshPosts(true);
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
          <Avatar sx={{ background: 'linear-gradient(45deg, #2196F3, 30%, #21CBF3 90%)',
                    color: 'white' }} aria-label="recipe">
            {userName.charAt(0).toUpperCase()}            
          </Avatar>
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
        <Typography variant="body2" color="text.secondary">
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
        </Typography>
      </CardContent>
    </Card>
    </div>
  );
}

export default PostForm;
