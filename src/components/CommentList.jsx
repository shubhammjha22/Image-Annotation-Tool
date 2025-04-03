import React from "react";
import { useStore } from "../store/store";

const CommentList = ({ imageIndex, onCommentSelect }) => {
  const { images } = useStore();

  if (!images[imageIndex] || !images[imageIndex].comments.length) {
    return <p className="no-comments">No comments yet</p>;
  }

  return (
    <ul className="comment-list flex flex-col gap-6 ">
      {images[imageIndex].comments.map((comment) => (
        <li
          key={comment.id}
          className="comment-list-item bg-gray-200 p-4"
          onClick={() => onCommentSelect(comment.id)}
        >
          <div className="comment-list-header">
            <span className="comment-number">#{comment.number}</span>
            <span className="comment-timestamp">
              {new Date(comment.timestamp).toLocaleString()}
            </span>
          </div>
          <p className="comment-text">{comment.text}</p>
          <div className="comment-meta">
            <span className="reply-count">
              {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
