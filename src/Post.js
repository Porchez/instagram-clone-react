import React, { useState, useEffect } from 'react'
import './Post.css'
import { Avatar } from '@material-ui/core'
import { db } from './firebase';
import { Button, Form } from 'react-bootstrap';
import firebase from "firebase";

function Post({ postId, user, username, caption, imageUrl, photoURL }) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection("posts").doc(postId).collection("comments").orderBy('timestamp', 'desc').onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc =>
                    doc.data()
                ))
            });
        }

        return () => {
            unsubscribe();
        }
    }, [postId]);

    const postComment = (e) => {
        e.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            comment: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        setComment('')
    };

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt=''
                    src={photoURL}
                />
                <h4> {username} </h4>
            </div>

            <img className="post__image" src={imageUrl}></img>

            <h5 className="post__capture"><strong>{username}</strong> {caption}</h5>

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.comment}
                    </p>
                ))}
            </div>

            <Form onSubmit={postComment} className="post__input">
                <Form.Control
                    className="post__input__comment"
                    type="text"
                    placeholder="Enter your comment..."
                    value={comment}
                    onChange={e => setComment(e.target.value)} />
                <Button className="post__btn" disabled={!comment || !user} type="submit" onClick={postComment}>
                    Post
                </Button>
            </Form>

        </div>
    )
}

export default Post