import React, { useState, useEffect } from "react";
import Post from "../Post/Post.js";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import PostForm from "../Post/PostForm.js";

function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    const refreshPosts = () => {
        fetch("/posts")
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
    }

    useEffect(() => {
        refreshPosts();
    }, [postList]);

    if (error) {
        return <div>Error !!!</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <React.Fragment>
                <CssBaseline />
                    <Box sx={{ bgcolor: '#f0f5ff', display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <PostForm userId = {1} userName={"deneme"} refreshPosts={refreshPosts} />
                        {postList.map(post => (
                            <Post likes = {post.postLike} userId = {post.userId} userName={post.userName} 
                            title={post.title} text={post.text} postId={post.id}/>
                        ))}
                    </Box>
            </React.Fragment>
        );
    }
}

export default Home;
