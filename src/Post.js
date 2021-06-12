import React from 'react'
import './Post.css'
import { Avatar } from '@material-ui/core'

function Post({ username, caption, imageUrl }) {
    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt=''
                    src=""
                />
                <h3> Username </h3>
                {/* heager -> avatar + username */}
            </div>

            <img className="post__image" src={imageUrl}></img>
            {/* image */}

            <h4 className="post__capture"><strong>{username}</strong> {caption}</h4>
            {/* username + caption -> big caption*/}

        </div>
    )
}

export default Post