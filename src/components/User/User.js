import React, { useState, useEffect } from "react";
import AvatarUser from "../Avatar/AvatarUser";
import UserActivity from "./UserActivity";
import { useParams } from "react-router-dom";
import { GetWithAuth } from "../../services/HttpService";


function User() {

    const {userId} = useParams();
    const [user, setUser] = useState();
    // eslint-disable-next-line
    const getUser = () => {
        GetWithAuth("/users/"+userId)
        .then(res => res.json())
        .then(
            (result) => {
                setUser(result)
            },
            (error) => {
                console.log(error)
            }
        )
    
    
    };
    useEffect(() => {
        getUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <div style={ {display:"flex"} }>
            {user? <AvatarUser avatarId={user.avatarId} userId={userId} userName={user.userName}/> : "" }
            {userId === localStorage.getItem("currentUser") ? <UserActivity userId = {userId}/> : ""}
        </div>
    )
}

export default User;