import React, { Suspense, useRef, useState } from "react";
import ImageUploader from "./components/ImageUploader";
import ImageViewer from "./components/ImageViewer";
import Sidebar from "./components/Sidebar";
import { useStore } from "./store/store";
// import ImageGallery from "./components/ImageGallery";
const ImageGallery = React.lazy(() => import("./components/ImageGallery"));

// import "./index.css";

function App() {
  const { images, addImage, setCurrentImageIndex } = useStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    files.forEach((file) => {
      if (!file.type.match("image.*")) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          src: event.target.result,
          name: file.name,
          comments: [],
        };
        addImage(newImage);
        // Set as current image if it's the first one
        if (images.length === 0) {
          setCurrentImageIndex(0);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // const [otp, setOtp] = useState(Array(6).fill(""));
  // const inputRef = useRef([]);

  // const handleChange = (e, index) => {
  //   const newOtp = [...otp];
  //   newOtp[index] = e.target.value;
  //   setOtp(newOtp);

  //   if (e.target.value && index < otp.length - 1) {
  //     inputRef.current[index + 1].focus();
  //   }
  // };

  // const handleKeyDown = (e, index) => {
  //   if (e.key === "Backspace" && !otp[index] && index > 0) {
  //     inputRef.current[index - 1].focus();
  //   }
  //   if (e.key === "ArrowLeft" && !otp[index] && index > 0) {
  //     inputRef.current[index - 1].focus();
  //   }
  //   if (e.key === "ArrowRight" && !otp[index] && index < otp.length - 1) {
  //     inputRef.current[index + 1].focus();
  //   }
  // };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="text-2xl font-semibold uppercase">
          Image Annotation Tool
        </h1>
        {images.length > 0 && <ImageUploader />}
      </header>
      <div className="main-content">
        {images.length > 0 ? (
          <>
            <Suspense
              fallback={
                <>
                  {" "}
                  <div>Loading....</div>{" "}
                </>
              }
            >
              <ImageGallery />
            </Suspense>
            {/* <ImageGallery /> */}
          </>
        ) : (
          <div
            className={`w-full flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-lg transition-colors ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <img
              src="/assets/upload_image.png"
              alt=""
              className="mb-4 w-24 h-24"
            />
            <p className="text-black flex flex-col items-center gap-2 font-semibold text-lg">
              {isDragging ? "Drop images here" : "Drag & Drop images here"}
              <span className="text-gray-500 text-sm font-normal">
                or use Upload button to upload images
              </span>
              <ImageUploader />
            </p>
          </div>
        )}
      </div>
      {/* <div className="w-full flex items-center justify-center p-16 text-black">
        {otp.map((digit, index) => {
          return (
            <input
              value={digit}
              type="text"
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRef.current[index] = el)}
              maxLength={1}
              className="w-10 h-10 mr-2 text-center text-red-400 border rounded text-lg outline-none focus:ring-2 focus:ring-blue-400"
              key={index}
            />
          );
        })}
      </div> */}
    </div>
  );
}

export default App;
