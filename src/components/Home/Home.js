import React, { useState, useEffect } from "react";
import Post from "../Post/Post.js";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import PostForm from "../Post/PostForm.js";

function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);
    const [refreshPost, setRefreshPost] = useState(false)

    const refreshPosts = () => {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        fetch(baseUrl+"/posts")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setPostList(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
        );
        setRefreshPost(false)
    }

    useEffect(() => {
        refreshPosts();
    }, [refreshPost]);

    if (error) {
        return (
        <div>
            <p>Under Maintenance</p>
            <span>You can email me </span>
            <a href="mailto:asirmak@outlook.com">asirmak@outlook.com</a>
            
        </div>);
    } else if (!isLoaded) {
        return <div>Loading... (It may take time (30 seconds))</div>;
    } else {
        return (
            <React.Fragment >
                <CssBaseline />
                    <Box sx={{ bgcolor: '#f0f5ff', display: "flex", flexDirection: "column", alignItems: "center"}}>
                        {localStorage.getItem("currentUser") === null? "":
                        <PostForm userId = {localStorage.getItem("currentUser")} refreshPosts={setRefreshPost} avatarId={localStorage.getItem("avatarId")}/>}
                        {postList.map(post => (
                            <Post
                            key={post.id} // Add the key prop here
                            initialLikes = {post.postLike} userId = {post.userId} userName={post.userName} 
                            title={post.title} text={post.text} postId={post.id} avatarId={post.avatarId}
                            refreshPosts={setRefreshPost}>
                            </Post>
                        ))}
                    </Box>
            </React.Fragment>
        );
    }
}

export default Home;
