import { Button } from 'react-bootstrap'
import React, { useState } from 'react'
import { storage, db } from './firebase'
import firebase from "firebase";
import './ImageUpload.css';

function ImageUpload({ username, photoURL }) {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [isUpload, setIsUpload] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            console.log(e.target.files);
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
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
                storage.ref("images").child(image.name).getDownloadURL().then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username,
                        photoURL: photoURL
                    });

                    setIsUpload(0);
                    setCaption("");
                    setImage(null);
                });
            }
        )
    };

    return (
        <div className="image-upload">
            <div className="image-upload__form">
                <progress className="image-upload__progress" value={isUpload} max="100" />
                <input className="image-upload__input__caption mt-2" type="text" value={caption} placeholder='Enter your caption' onChange={e => setCaption(e.target.value)} />
                <input className="mt-2" type="file" onChange={handleChange} />
                <Button className="mt-2" onClick={handleUpload} disabled={!caption || !image}>
                    Upload
                </Button>
            </div>
        </div>
    )
}

export default ImageUpload
