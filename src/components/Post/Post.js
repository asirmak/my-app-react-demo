import React, { useState, useEffect, useRef} from 'react';
import { Link } from "react-router-dom";
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
import { Container } from '@mui/material';
import Comment from '../Comment/Comment';
import CommentForm from '../Comment/CommentForm';
import { DeleteWithAuth, PostWithAuth } from '../../services/HttpService';

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
  const {likes, title, text, userId, userName, postId} = props;
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [likeId, setLikeId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const isInitialMount = useRef(true);

  let disabled = (localStorage.getItem("currentUser") == null ? true:false);
 
  const refreshComments = () => {
    fetch("/comments?postId=" + postId)
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

    setRefresh(false)
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    if(!isLiked){
      saveLike();
      setLikeCount(likeCount + 1)
    }
    else{
      deleteLike();
      setLikeCount(likeCount - 1)
    }
      
   }
  const saveLike = () => {
    PostWithAuth("/likes", {
      postId: postId, 
      userId : localStorage.getItem("currentUser"),
    })
    .then((res) => res.json())
    .catch((err) => console.log(err))
  }

  const deleteLike = () => {
    DeleteWithAuth("/likes/"+likeId)
      .catch((err) => console.log(err))
  }

  const checkLikes = () => {
    var likeControl = likes.find((like => ""+like.userId === localStorage.getItem("currentUser")));
    if(likeControl != null){
      setLikeId(likeControl.id);
      setIsLiked(true);
    }
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
    if (!expanded) {
      refreshComments();
    }
  };

  useEffect(() => {
    if(isInitialMount.current)
      isInitialMount.current = false;
    else {
      refreshComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[refresh]);
  useEffect(() => {checkLikes()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Card sx={{ width: 800, textAlign: "left", margin: 3 }}>
      <CardHeader
        avatar={
          <Link to={{ pathname: '/users/' + userId }} style={{ color: 'white', textDecoration: 'none', boxShadow: 'none' }}>
            <Avatar sx={{ background: 'linear-gradient(45deg, #2196F3, 30%, #21CBF3 90%)', color: 'white' }} aria-label="recipe">
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </Link>
        }
        title={title}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {disabled?
        <IconButton
          disabled
          onClick={handleLike}
          aria-label="add to favorites"
        >
          <FavoriteIcon style={isLiked ? { color: 'red' } : null} />
        </IconButton> :
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
              key={comment.id}
              userId={comment.userId} userName={comment.userName} text={comment.text} />
            ))
          ) : (
            "Loading"
          )}
          {disabled? "" : <CommentForm userId={localStorage.getItem("currentUser")} userName={localStorage.getItem("userName")} postId={postId} setRefresh={setRefresh} />}
        </Container>
      </Collapse>
    </Card>
  );
}

export default Post;
