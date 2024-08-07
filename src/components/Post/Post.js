import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { Alert, Container, Snackbar } from '@mui/material';
import Comment from '../Comment/Comment';
import CommentForm from '../Comment/CommentForm';
import { DeleteWithAuth, PostWithAuth, RefreshToken } from '../../services/HttpService';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Post(props) {
  const { initialLikes, title, text, userId, userName, postId, avatarId, refreshPosts} = props;
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [likeId, setLikeId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [isDeletionSuccessfull, SetIsDeletionSuccessfull] = useState(false);
  const [isDeletionFailed, SetIsDeletionFailed] = useState(false);

  let disabled = (localStorage.getItem("currentUser") == null ? true : false);

  let navigate = useNavigate();

  const logout = () => {
      localStorage.removeItem("tokenKey");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("username");
      localStorage.removeItem("refreshKey")
      localStorage.removeItem("avatarId");
      navigate(0)
  }

  const addLike = () => {
    const newLike = { userId: localStorage.getItem("currentUser"), postId: postId };
    PostWithAuth("/likes", newLike)
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
                addLike();
            }
        })
        .catch((err) => {
          if (err.message !== "Unauthorized") {
            console.log(err);
          }
        });
    }
    else {
        return res.json()
    } 
    })
    .then((data) => {
      const likeData = { ...data, ...newLike };
      setLikes([...likes, likeData]);
      setLikeId(likeData.id);
    })
    .catch((err) => {
      if (err.message !== "Unauthorized") {
        console.log(err);
      }
    });
  };

  const deleteLike = () => {
    DeleteWithAuth("/likes/" + likeId)
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
            deleteLike();
          }
        })
        .catch((err) => {
          if (err.message !== "Unauthorized") {
            console.log(err);
          }
        });
      }
      else{
        setLikes(likes.filter((like) => like.id !== likeId));
      }
    })
    .catch((err) => {
      if (err.message !== "Unauthorized") {
        console.log(err);
      }
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      addLike();
      setLikeCount(likeCount + 1);
    } else {
      deleteLike();
      setLikeCount(likeCount - 1);
    }
  };

  const refreshComments = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;

    fetch(baseUrl+"/comments?postId=" + postId)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setCommentList(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );

    setRefresh(false);
  };

  const checkLikes = () => {
    const likeControl = likes.find((like) => "" + like.userId === localStorage.getItem("currentUser"));
    if (likeControl != null) {
      setLikeId(likeControl.id);
      setIsLiked(true);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
    if (!expanded) {
      refreshComments();
    }
  };

  const handlePostDelete = () => {
    if(userId === +(localStorage.getItem("currentUser"))){
      deletePost().then( () => {
        refreshPosts(true);
        SetIsDeletionSuccessfull(true);
      })
    }
    else{
      SetIsDeletionFailed(true);
    }
  }

  const deletePost = () => {
    return DeleteWithAuth("/posts/" + postId)
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
            deletePost();
            refreshPosts(true);
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

  useEffect(() => {
    if (isInitialMount)
      setIsInitialMount(false)
    else{
      refreshComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => { checkLikes(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  
  return (
    <div>
      <Snackbar open={isDeletionSuccessfull} autoHideDuration={3000} onClose={handleCloseDeletionSuccess} anchorOrigin={ {vertical : 'bottom', horizontal:'center'}}>
        <Alert
            onClose={handleCloseDeletionSuccess}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}>
            Post deleted successfully.
        </Alert>
      </Snackbar>
      <Snackbar open={isDeletionFailed} autoHideDuration={3000} onClose={handleCloseDeletionFailed} anchorOrigin={ {vertical : 'bottom', horizontal:'center'}}>
        <Alert
            onClose={handleCloseDeletionFailed}
            severity='error'
            variant="filled"
            sx={{ width: '100%' }}>
            Only post owner can delete!
         </Alert>
      </Snackbar>

    <Card sx={{ width: 800, textAlign: "left", margin: 3 }}>
      <CardHeader
        avatar={
          <Link to={{ pathname: '/users/' + userId }} style={{ color: 'white', textDecoration: 'none', boxShadow: 'none' }}>
              <Avatar src={`/avatars/avatar${avatarId}.png`}/>
          </Link>
        }
        title={title}
        subheader={
          <Link to={{ pathname: '/users/' + userId }} style={{color: '#A9A9A9',  textDecoration:'none', boxShadow:'none'}} >
            {`@${userName}`}
          </Link>
        }
        action={refreshPosts !== undefined ?
          (<IconButton size="big" 
          onClick={() => handlePostDelete()}>
            <DeleteForeverIcon/>
          </IconButton>) 
          : ""
        }
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </CardContent>
      
      <CardActions disableSpacing>
        {disabled ?
          <IconButton
            disabled
            onClick={handleLike}
            aria-label="add to favorites"
          >
            <FavoriteIcon style={isLiked ? { color: 'red' } : null} />
          </IconButton> 
          :
          <IconButton
            onClick={handleLike}
            aria-label="add to favorites"
          >
            <FavoriteIcon style={isLiked ? { color: 'red' } : null} />
          </IconButton>}
        {likeCount}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <CommentIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Container fixed>
          {error ? (
            "Error"
          ) : isLoaded ? (
            commentList.map(comment => (
              <Comment
                commentId={comment.id}
                userId={comment.userId} userName={comment.userName} text={comment.text} 
                avatarId={comment.avatarId} setRefresh={setRefresh} postUserId={userId}/>
            ))
          ) : (
            "Loading"
          )}
          {disabled ? "" : <CommentForm userId={localStorage.getItem("currentUser")} postId={postId} setRefresh={setRefresh} 
                            avatarId={localStorage.getItem("avatarId")}/>}
        </Container>
      </Collapse>
    </Card>
    </div>
  );
}

export default Post;
