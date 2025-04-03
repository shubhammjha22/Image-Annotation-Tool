import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../store/store";
import { Image } from "lucide-react";
import ImageViewer from "./ImageViewer";
import Sidebar from "./Sidebar";

const ImageGallery = () => {
  const { images, setCurrentImageIndex } = useStore();
  const [viewMode, setViewMode] = useState(false);
  const viewerContainerRef = useRef(null);

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setViewMode(true);
  };

  // Handle clicks outside the image viewer
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only check clicks when in view mode
      if (!viewMode) return;

      // Check if click is directly on the overlay (black background)
      // but not on the image viewer or sidebar content
      if (
        viewerContainerRef.current &&
        event.target.classList.contains("overlay-background") &&
        !viewerContainerRef.current.contains(event.target)
      ) {
        setViewMode(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [viewMode]);

  return (
    <>
      <div className="image-gallery-container p-6">
        <div className="flex items-center gap-8 p-2 ">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="image-card bg-white rounded-lg shadow-md p-2"
              onClick={() => handleImageClick(index)}
            >
              <div className="w-[16rem] hover:shadow-lg relative cursor-pointer">
                <div className="image-info">
                  <span className="flex gap-2 items-center">
                    <Image fill="#FFB444" stroke="white" className="" />{" "}
                    {image.name}
                  </span>
                </div>
                <img
                  src={image.src}
                  className="object-cover max-h-[16rem] hover:scale-[102%] transition-all duration-300 ease-in-out delay-200 aspect-[1/1] rounded-lg"
                  alt={image.name}
                />
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="empty-gallery">
            <p>No images uploaded yet</p>
            <p>Upload images to get started with annotations</p>
          </div>
        )}
      </div>

      {viewMode && (
        <div className="absolute flex top-0 left-0 h-full w-full bg-black bg-opacity-90 z-50 overlay-background">
          <div
            ref={viewerContainerRef}
            className="flex  w-fit h-fit mx-auto ml-[7rem] my-auto relative"
          >
            <ImageViewer />
          </div>
          <div className="absolute right-0 h-screen  bg-white overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
