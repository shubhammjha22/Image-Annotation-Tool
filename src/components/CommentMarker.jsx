import React from "react";

const CommentMarker = ({ comment, isActive, onClick }) => {
  return (
    <div
      className={`comment-marker ${isActive ? "active" : ""}`}
      style={{
        left: `${comment.position.x}%`,
        top: `${comment.position.y}%`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <span className="marker-number">{comment.number}</span>
    </div>
  );
};

export default CommentMarker;
