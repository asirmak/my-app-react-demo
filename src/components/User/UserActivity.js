import React, { useState, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Post from '../Post/Post';
import { GetWithAuth, RefreshToken } from '../../services/HttpService';

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
    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("username");
        localStorage.removeItem("refreshKey")
        navigate(0);
    }

    const getPost = () => {
      GetWithAuth("/posts/"+postId)
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
                    getPost();
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
          if (data !== undefined){
            setPost(data);
          }
        })
        .catch((err) => {
            console.log(err);
        });   
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              </Toolbar>
            </AppBar>
            <Post 
              initialLikes={post.postLike} 
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

  let navigate = useNavigate();

  const logout = () => {
      localStorage.removeItem("tokenKey");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("username");
      localStorage.removeItem("refreshKey")
      navigate(0);
  }

  const handleNotification = (postId) =>{
    setSelectedPost(postId);
    setIsOpen(true)
  }
  const getActivity = () => {
    GetWithAuth("/users/activity/"+userId)
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
                  getActivity();
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
        if (data !== undefined){
          setActivityList(data);
        }
      })
      .catch((err) => {
          console.log(err);
      }); 
  };
  useEffect(() => {
    getActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <TableCell align="center">
                    <Button  onClick={ () => handleNotification(row[1]) }>
                      {`${row[3]} ${row[0]} your post`}
                    </Button>
                    </TableCell>
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