import React, { useState, useEffect } from "react";
import AvatarUser from "../Avatar/AvatarUser";
import UserActivity from "./UserActivity";
import { useParams } from "react-router-dom";
import { GetWithAuth, RefreshToken } from "../../services/HttpService";
import { useNavigate } from "react-router-dom";



function User() {

    const {userId} = useParams();
    const [user, setUser] = useState();

    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("username");
        localStorage.removeItem("refreshKey")
        navigate(0);
    }
    
    const getUser = () => {
        GetWithAuth("/users/"+userId)
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
                      getUser();
                  }
              })
              .catch((err) => {
                  console.log(err);
              });
          }
          else {
              return res.json()
          } 
          })
          .then((data) => {
            setUser(data)
          })
          .catch((err) => {
              console.log(err);
          });   
    };

    useEffect(() => {
        getUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    
    return (
        <div style={{ display: "flex" }}>
            {user? <AvatarUser avatarId={user.avatarId} userId={user.id} userName={user.userName} /> : ""}
            {userId === localStorage.getItem("currentUser") ? <UserActivity userId={userId} /> : ""}
        </div>
    );    
}

export default User;