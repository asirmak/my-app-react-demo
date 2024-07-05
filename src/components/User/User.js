import React, { useState, useEffect } from "react";
import AvatarUser from "../Avatar/AvatarUser";
import UserActivity from "./UserActivity";
import { useParams } from "react-router-dom";


function User() {

    const {userId} = useParams();
    const [user, setUser] = useState();

    const getUser = () => {
        fetch("/users/"+userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("tokenKey"),
            },
        })
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
                setUser(result)
            },
            (error) => {
                console.log(error)
            }
        )
    
    
    };

    useEffect(() => {
        getUser();
    }, []);

    return(
        <div style={ {display:"flex"} }>
            {user? <AvatarUser avatarId={user.avatarId}/> : "" }
            <UserActivity userId = {userId}/>
        </div>
    )
}

export default User;