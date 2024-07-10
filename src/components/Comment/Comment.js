import { CardContent, InputAdornment, OutlinedInput } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';


function Comment(props) {
    const {text, userId, userName, avatarId} = props;
    
    return(
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
        style={ {color: "black", backgroundColor: "white"}}
        >
        </OutlinedInput>
        </CardContent>
    );

}

export default Comment;