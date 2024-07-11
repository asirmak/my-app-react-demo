import {Alert, CardContent, IconButton, InputAdornment, OutlinedInput, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DeleteWithAuth, RefreshToken } from "../../services/HttpService";
import { useNavigate } from "react-router-dom";


function Comment(props) {
    const {commentId, text, userId, userName, avatarId, setRefresh, postUserId} = props;
    const [isDeletionSuccessfull, SetIsDeletionSuccessfull] = useState(false);
    const [isDeletionFailed, SetIsDeletionFailed] = useState(false);
    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("username");
        localStorage.removeItem("refreshKey")
        localStorage.removeItem("avatarId");
        navigate(0)
    }

    const deleteComment = () => {
      DeleteWithAuth("/comments/" + commentId)
      .then((res) => {
        if (!res.ok){
          RefreshToken()
          .then((res) => {
            if(!res.ok){
              logout();
            }
            else{
              return res.json();
            }
          })
          .then((result) => {
            if (result !== undefined){
              localStorage.setItem("tokenKey", result.accessToken);
              deleteComment();
              setRefresh(true);
            }
          })
          .catch((err) => {
            if (err.message !== "Unauthorized") {
              console.log(err);
            }
          });
        }
      })
      .catch((err) => {
        if (err.message !== "Unauthorized") {
          console.log(err);
        }
      });
    };


    const handleCommentDelete = () => {
      if(userId === +(localStorage.getItem("currentUser")) || postUserId === +(localStorage.getItem("currentUser"))){
        deleteComment();
        setRefresh(true);
        SetIsDeletionSuccessfull(true);
      }
      else{
        SetIsDeletionFailed(true);
      }
    }

    const handleCloseDeletionSuccess = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      SetIsDeletionSuccessfull(false);
    };
  
    const handleCloseDeletionFailed = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      SetIsDeletionFailed(false);
    };

    return(

        <div>
          <Snackbar open={isDeletionSuccessfull} autoHideDuration={3000} onClose={handleCloseDeletionSuccess} anchorOrigin={ {vertical : 'bottom', horizontal:'center'}}>
            <Alert
                onClose={handleCloseDeletionSuccess}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}>
                Comment deleted successfully.
            </Alert>
          </Snackbar>
          <Snackbar open={isDeletionFailed} autoHideDuration={3000} onClose={handleCloseDeletionFailed} anchorOrigin={ {vertical : 'bottom', horizontal:'center'}}>
            <Alert
                onClose={handleCloseDeletionFailed}
                severity='error'
                variant="filled"
                sx={{ width: '100%' }}>
                Only post or comment owner can delete!
            </Alert>
          </Snackbar>

          <CardContent sx={ {display: "flex", flexWrap: "wrap", justifyContent : "flex-start", alignItems : "center"} }>
            <OutlinedInput
            disabled
            id="outlined-adornment-amount"
            multiline
            inputProps={{maxLength : 25}}
            fullWidth
            value={`${userName}: ${text}`}
            startAdornment = {
                <InputAdornment position = "start">
                  <Link to={{ pathname: '/users/' + userId }} style={{ color: 'white', textDecoration: 'none', boxShadow: 'none' }}>
                    <Avatar src={`/avatars/avatar${avatarId}.png`}/>
                  </Link>
                </InputAdornment>
            }
            endAdornment = {
              <IconButton size="small"
              onClick={() => handleCommentDelete()}
              >
                    <DeleteForeverIcon/>
              </IconButton>
            }
            style={ {color: "black", backgroundColor: "white"}}
            >
            </OutlinedInput>
          </CardContent>
        </div>
        
    );

}

export default Comment;