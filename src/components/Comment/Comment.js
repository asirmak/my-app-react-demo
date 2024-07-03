import { CardContent, InputAdornment, OutlinedInput } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';


function Comment(props) {
    const {text, userId, userName} = props;
    
    return(
        <CardContent sx={ {display: "fles", flexWrap: "wrap", justifyContent : "flex-start", alignItems : "center"} }>
        <OutlinedInput
        disabled
        id="outlined-adornment-amount"
        multiline
        inputProps={{maxLength : 25}}
        fullWidth
        value={text}
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
        >
        </OutlinedInput>
        </CardContent>
    );

}

export default Comment;