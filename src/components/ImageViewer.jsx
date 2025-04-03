import React, { useState, useRef } from "react";
import { useStore } from "../store/store";
import CommentMarker from "./CommentMarker";
import CommentPopup from "./CommentPopup";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageViewer = () => {
  const {
    images,
    currentImageIndex,
    addComment,
    comments,
    setCurrentImageIndex,
  } = useStore();
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [newCommentPosition, setNewCommentPosition] = useState(null);
  const [commentText, setCommentText] = useState("");
  const imageRef = useRef(null);

  const currentImage = images[currentImageIndex];
  const imageComments = currentImage ? currentImage.comments : [];

  const handleImageClick = (e) => {
    if (!imageRef.current) return;

    // Get the clicked element and check if it's a marker or part of a popup
    const isMarkerOrPopup =
      e.target.closest(".comment-marker") ||
      e.target.closest(".comment-popup") ||
      e.target.closest(".new-comment-popup") ||
      e.target.closest(".navigator");

    // Only set a new comment position if we're not clicking on a marker or popup
    if (!isMarkerOrPopup) {
      // Close any open comment popup first
      setActiveCommentId(null);

      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setNewCommentPosition({ x, y });
      setCommentText(""); // Reset comment text when creating a new comment
    }
  };

  const handleAddComment = () => {
    if (!newCommentPosition || !commentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      position: newCommentPosition,
      text: commentText,
      replies: [],
      timestamp: new Date().toISOString(),
    };

    addComment(currentImageIndex, newComment);
    setNewCommentPosition(null);
    setCommentText("");
  };

  const handleMarkerClick = (commentId, e) => {
    // Prevent event from bubbling up to the image
    if (e) e.stopPropagation();

    // Toggle the active comment
    setNewCommentPosition(null);
    setActiveCommentId(activeCommentId === commentId ? null : commentId);
  };

  const closePopup = () => {
    setActiveCommentId(null);
    setNewCommentPosition(null);
  };

  const navigateImage = (direction) => {
    const newIndex = currentImageIndex + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setCurrentImageIndex(newIndex);
      // Close any open popups when navigating
      setActiveCommentId(null);
      setNewCommentPosition(null);
    }
  };

  if (!currentImage) return <div>No image selected</div>;

  return (
    <div className="parentContainer mx-auto  flex flex-col items-center justify-center ">
      <div className="relative mx-auto w-fit" onClick={handleImageClick}>
        <div
          className="relative flex items-center gap-1 justify-center mx-auto h-full"
          ref={imageRef}
        >
          <button
            className="px-2 py-1 absolute -left-10 navigator bg-gray-800 text-white rounded-full disabled:opacity-50"
            onClick={() => navigateImage(-1)}
            disabled={currentImageIndex === 0}
          >
            <ChevronLeft />
          </button>
          <img
            src={currentImage.src}
            alt={currentImage.name}
            className="object-contain w-[68vw] h-[600px] rounded-lg"
          />
          <button
            className="px-2 py-1 navigator absolute -right-10  bg-gray-800 text-white rounded-full disabled:opacity-50"
            onClick={() => navigateImage(1)}
            disabled={currentImageIndex === images.length - 1}
          >
            <ChevronRight />
          </button>

          {imageComments.map((comment) => (
            <CommentMarker
              key={comment.id}
              comment={comment}
              isActive={activeCommentId === comment.id}
              onClick={(e) => handleMarkerClick(comment.id, e)}
              className="comment-marker"
            />
          ))}

          {activeCommentId && (
            <CommentPopup
              comment={imageComments.find((c) => c.id === activeCommentId)}
              onClose={closePopup}
              imageIndex={currentImageIndex}
              className="comment-popup"
            />
          )}

          {newCommentPosition && (
            <div
              className="absolute  new-comment-popup"
              style={{
                left: `${newCommentPosition.x}%`,
                top: `${newCommentPosition.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
              onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to image
            >
              <div className=" rounded-lg overflow-hidden  min-w-[250px]">
                <textarea
                  className="w-full border-none rounded mb-2"
                  placeholder="Add a comment..."
                  autoFocus
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    } else if (e.key === "Escape") {
                      setNewCommentPosition(null);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
                />
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewCommentPosition(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddComment();
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      {/* <div className="flex justify-center mt-4 space-x-4">
        <button
          className="px-2 py-1 bg-gray-800 text-white rounded-lg disabled:opacity-50"
          onClick={() => navigateImage(-1)}
          disabled={currentImageIndex === 0}
        >
          <ChevronLeft />
        </button>
        <button
          className="px-2 py-1 bg-gray-800 text-white rounded-lg disabled:opacity-50"
          onClick={() => navigateImage(1)}
          disabled={currentImageIndex === images.length - 1}
        >
          <ChevronRight />
        </button>
      </div> */}
    </div>
  );
};

export default ImageViewer;
