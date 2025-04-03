import React, { useState } from "react";
import { useStore } from "../store/store";
import CommentList from "./CommentList";

const Sidebar = () => {
  const { currentImageIndex, images, setActiveCommentId } = useStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCommentSelect = (commentId) => {
    setActiveCommentId(commentId);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h3>Comments</h3>
      </div>

      {!isCollapsed && (
        <div className="sidebar-content">
          {images.length > 0 ? (
            <>
              <div className="image-info">
                <h4>{images[currentImageIndex].name}</h4>
                <p>
                  Total comments - {images[currentImageIndex].comments.length}{" "}
                </p>
              </div>
              <div className="">
                <CommentList
                  imageIndex={currentImageIndex}
                  onCommentSelect={handleCommentSelect}
                />
              </div>
            </>
          ) : (
            <p>No images uploaded</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
