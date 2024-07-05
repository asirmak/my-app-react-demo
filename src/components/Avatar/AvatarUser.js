import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';

function AvatarUser(props) {
    const {avatarId} = props
    const [open, setOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(avatarId);

    const handleClose = () => {
        setOpen(false);
        saveAvatar();
    }
    const handleOpen = () => setOpen(true);

    const handleToggle = (value) => () => {
        setSelectedAvatar(value);
    };

    const saveAvatar = () => {
        fetch("/users/"+localStorage.getItem("currentUser"), {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": localStorage.getItem("tokenKey"),
            },
            body: JSON.stringify({
                avatar: selectedAvatar,
            }),
        })
          .then((res) => res.json())
          .catch((err) => console.log("error"))
      }



    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Card sx={{maxWidth: 350, margin: 3 }}>
            <CardMedia
                component="img"
                alt="user avatar"
                image={`/avatars/avatar${selectedAvatar}.png`}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Username
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    User information
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleOpen}>Change Avatar</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <List dense sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}>
                            {[0, 1, 2, 3, 4, 5, 6].map((value) => {
                                const labelId = `checkbox-list-secondary-label-${value}`;
                                return (
                                    <ListItem
                                        key={value}
                                        onClick={handleToggle(value)}
                                        disablePadding
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar >
                                                <Avatar
                                                    alt={`Avatar n°${value + 1}`}
                                                    src={`/avatars/avatar${value}.png`}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText id={labelId} primary={`Avatar ${value + 1}`} />
                                            <Checkbox
                                                edge="end"
                                                onChange={handleToggle(value)}
                                                checked={selectedAvatar === value}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </Modal>
            </CardActions>
        </Card>
    );
}

export default AvatarUser;
