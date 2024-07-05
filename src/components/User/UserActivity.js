import React, { useState, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Post from '../Post/Post';

const columns = [
  {
    id: 'User Activity',
    label: 'User Activity',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  }
];
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function DialogScreen(props) {
    const {isOpen, postId, setIsOpen} = props
    const [open, setOpen] = React.useState(false);
    const [post, setPost] = useState(null);

    const getPost = () => {
        fetch("/posts/"+postId, {
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
                setPost(result)
            },
            (error) => {
                console.log(error)
            }
        )
    
    
    };

    const handleClose = () => {
        setOpen(false);
        setIsOpen(false);
    };

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        getPost();
    }, [postId]);
     
    return (
        post !== null ? (
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                  Sound
                </Typography>
                <Button autoFocus color="inherit" onClick={handleClose}>
                  save
                </Button>
              </Toolbar>
            </AppBar>
            <Post 
              likes={post.postLike} 
              userId={post.userId} 
              userName={post.userName} 
              title={post.title} 
              text={post.text} 
              postId={post.id} 
            />
          </Dialog>
        ) : (
          <Typography variant="h6" component="div" sx={{ textAlign: 'center', marginTop: 2 }}>
            Loading...
          </Typography>
        )
      );
      
}



function UserActivity(props) {

  const {userId} = props;   
  const [page] = useState(0);
  const [rowsPerPage] = useState(10);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const [activityList, setActivityList] = useState([]);

  const handleNotification = (postId) =>{
    setSelectedPost(postId);
    setIsOpen(true)
  }

  const getActivity = () => {
      fetch("/users/activity/"+userId, {
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
              setActivityList(result)
          },
          (error) => {
              console.log(error)
          }
      )
  
  
  };

  useEffect(() => {
    getActivity();
  }, []);

  return (
    <div>
    {isOpen? <DialogScreen isOpen={isOpen} postId={selectedPost} setIsOpen={setIsOpen}></DialogScreen> : ""}
    <Paper sx={{ width: '100%', overflow: 'hidden', margin: 3 }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activityList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <Button  onClick={ () => handleNotification(row[1]) }>
                    <TableCell align="center">
                      {`${row[3]} ${row[0]} your post`}
                    </TableCell>
                    </Button>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
    </div>
  );
}

export default UserActivity;