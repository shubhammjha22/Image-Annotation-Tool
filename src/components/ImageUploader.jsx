import React, { useRef } from "react";
import { useStore } from "../store/store";
import { Upload } from "lucide-react";

const ImageUploader = () => {
  const fileInputRef = useRef(null);
  const { images, addImage, setCurrentImageIndex } = useStore();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

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

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="">
      <button
        onClick={handleClick}
        className="bg-blue-500 text-md flex gap-4 items-center text-white p-2 rounded"
      >
        <Upload />
        Upload Images
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ImageUploader;
