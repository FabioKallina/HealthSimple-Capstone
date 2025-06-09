import React, { useState } from 'react'

const AddComment = ({ discussionId, onAddComment }) => {

    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if ( comment.trim() === "" ) return;
        onAddComment(discussionId, comment);
        setComment("");
    }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
        <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Reply</button>
    </form>
  )
}

export default AddComment