import React, { useState } from 'react'
import { Avatar } from '@material-ui/core'
import { Modal, Button, Form } from 'react-bootstrap';
import './Profile.css'
import { storage, auth, db } from './firebase'

function Profile({ user }) {
    const [image, setImage] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [isUpload, setIsUpload] = useState(0);


    const handleEdit = async () => {
        if (!image) {
            const oldName = user.displayName;
            await auth.currentUser.updateProfile({
                displayName: newUsername
            }).then(() => {
                db.collection("posts").where("username", "==", oldName).onSnapshot(snapshot => {
                    snapshot.docs.map(doc => {
                        console.log(doc.id, doc.data());
                        return db.collection("posts").doc(doc.id).update({
                            username: newUsername ? (newUsername) : (user.displayName)
                        });
                    })
                });
                setIsUpload(0);
                setNewUsername("");
                setImage(null);
                setShowEditProfile(false);
            }).catch((error) => {
                // An error occurred
                // ...
            });

        } else {
            const oldName = user.displayName;
            const upload = storage.ref(`images/${image.name}`).put(image);
            upload.on(
                "state_changed", (snapshot) => {
                    const uploading = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setIsUpload(uploading);
                },
                (error) => {
                    console.error(error);
                    alert(error)
                },
                () => {
                    storage.ref("images").child(image.name).getDownloadURL().then(async (url) => {
                        await auth.currentUser.updateProfile({
                            displayName: newUsername ? (newUsername) : (user.displayName),
                            photoURL: url
                        }).then(() => {
                            db.collection("posts").where("username", "==", oldName).onSnapshot(snapshot => {
                                snapshot.docs.map(doc => {
                                    return db.collection("posts").doc(doc.id).update({
                                        username: newUsername ? (newUsername) : (user.displayName),
                                        photoURL: url
                                    });
                                })
                            })
                        });
                        setIsUpload(0);
                        setNewUsername("");
                        setImage(null);
                        setShowEditProfile(false);
                    });
                }
            )
        }
    };

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const onHide = (e) => {
        setIsUpload(0);
        setNewUsername("");
        setImage(null);
        setShowEditProfile(false)
    };


    return (
        <div className="avatar__profile">
            <Modal
                id="modal-edit-profile"
                show={showEditProfile}
                onHide={onHide}
                centered
            >
                <Modal.Body>
                    <div className="modal__edit__profile">
                        <progress className="modal__edit__profile__progress" value={isUpload} max="100" />
                        <input className="mt-3" type="file" onChange={handleChange} />
                        <div className="modal__edit__profile__input__name mt-3">
                            <input
                                className="edit__input__name"
                                type="text"
                                placeholder="Enter your name..."
                                value={newUsername}
                                onChange={e => setNewUsername(e.target.value)} />
                            <Button className="edit__input__btn" disabled={!newUsername && !image} type="submit" onClick={handleEdit}>
                                Update
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Avatar
                className="avatar__img mr-3"
                alt=''
                src={user?.photoURL ? (user.photoURL) : ('')}
            />
            <h4 className="avatar__name mr-3"> {user?.displayName ? (user.displayName) : ('undefined')} </h4>
            <Button className="avatar__btn__edit" onClick={e => setShowEditProfile(true)}> Edit</Button>
        </div>
    )
}

export default Profile
