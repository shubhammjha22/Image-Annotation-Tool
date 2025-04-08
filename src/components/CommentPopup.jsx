import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../store/store";

const CommentPopup = ({ comment, onClose, imageIndex }) => {
  const { updateComment, deleteComment, addReply, deleteReply, updateReply } =
    useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [replyText, setReplyText] = useState("");
  const popupRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce function for input
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSetEditedText = debounce(setEditedText, 200);

  // Handle clicks outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Focus input when editing
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    if (editedText.trim()) {
      updateComment(imageIndex, comment.id, editedText);
      setIsEditing(false);
    }
  };
  const handleReplyEditSave = () => {
    if (editedText.trim()) {
      updateReply(imageIndex, comment.id, editedText);
      setIsEditing(false);
    }
  };

  const handleAddReply = () => {
    if (replyText.trim()) {
      const newReply = {
        id: Date.now().toString(),
        text: replyText,
        timestamp: new Date().toISOString(),
      };
      addReply(imageIndex, comment.id, newReply);
      setReplyText("");
    }
  };

  return (
    <div
      className="comment-popup"
      style={{
        left: `${comment.position.x}%`,
        top: `${comment.position.y}%`,
      }}
      ref={popupRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="popup-header">
        <span className="comment-number">#{comment.number}</span>
        <div className="popup-actions">
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <button
            className="delete-btn"
            onClick={() => {
              deleteComment(imageIndex, comment.id);
              onClose();
            }}
          >
            Delete
          </button>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
      </div>

      <div className="comment-content">
        {isEditing ? (
          <>
            <textarea
              ref={inputRef}
              value={editedText}
              onChange={(e) => debouncedSetEditedText(e.target.value)}
              className="edit-textarea"
            />
            <div className="edit-actions">
              <button onClick={() => setIsEditing(false)}>Cancel</button>
              <button onClick={handleSaveEdit}>Save</button>
            </div>
          </>
        ) : (
          <p className="comment-text">{comment.text}</p>
        )}
        <span className="comment-timestamp">
          {new Date(comment.timestamp).toLocaleString()}
        </span>
      </div>

      <div className="comment-replies">
        <h4>Replies</h4>
        {comment.replies.length > 0 ? (
          <ul className="reply-list">
            {comment.replies.map((reply) => (
              <li key={reply.id} className="reply-item">
                <input className="reply-text" value={reply.text} />
                <div className="reply-meta">
                  <span className="reply-timestamp">
                    {new Date(reply.timestamp).toLocaleString()}
                  </span>
                  <button
                    className="delete-reply-btn"
                    onClick={() => handleReplyEditSave()}
                  >
                    edit
                  </button>
                  <button
                    className="delete-reply-btn"
                    onClick={() =>
                      deleteReply(imageIndex, comment.id, reply.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-replies">No replies yet</p>
        )}
      </div>

      <div className="add-reply">
        <textarea
          placeholder="Add a reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="reply-textarea"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAddReply();
            }
          }}
        />
        <button className="add-reply-btn" onClick={handleAddReply}>
          Reply
        </button>
      </div>
    </div>
  );
};

export default CommentPopup;
