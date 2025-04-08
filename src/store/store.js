import { persist } from "zustand/middleware";
import { create } from "zustand";
export const useStore = create(
  persist(
    (set, get) => ({
      images: [],
      currentImageIndex: 0,
      activeCommentId: null,

      // Image actions
      addImage: (newImage) =>
        set((state) => ({
          images: [...state.images, { ...newImage, comments: [] }],
        })),

      setCurrentImageIndex: (index) => set({ currentImageIndex: index }),

      setActiveCommentId: (commentId) => set({ activeCommentId: commentId }),

      // Comment actions
      addComment: (imageIndex, newComment) =>
        set((state) => {
          const updatedImages = [...state.images];
          if (!updatedImages[imageIndex]) return state;

          // Assign a number to the comment (sequential for each image)
          const commentNumber = updatedImages[imageIndex].comments.length + 1;
          newComment.number = commentNumber;

          updatedImages[imageIndex] = {
            ...updatedImages[imageIndex],
            comments: [...updatedImages[imageIndex].comments, newComment],
          };

          return { images: updatedImages };
        }),

      updateComment: (imageIndex, commentId, newText) =>
        set((state) => {
          const updatedImages = [...state.images];
          if (!updatedImages[imageIndex]) return state;

          const commentIndex = updatedImages[imageIndex].comments.findIndex(
            (c) => c.id === commentId
          );

          if (commentIndex === -1) return state;

          updatedImages[imageIndex].comments[commentIndex] = {
            ...updatedImages[imageIndex].comments[commentIndex],
            text: newText,
          };

          return { images: updatedImages };
        }),

      deleteComment: (imageIndex, commentId) =>
        set((state) => {
          const updatedImages = [...state.images];
          if (!updatedImages[imageIndex]) return state;

          updatedImages[imageIndex] = {
            ...updatedImages[imageIndex],
            comments: updatedImages[imageIndex].comments.filter(
              (c) => c.id !== commentId
            ),
          };

          // Renumber the remaining comments
          updatedImages[imageIndex].comments.forEach((comment, index) => {
            comment.number = index + 1;
          });

          return { images: updatedImages };
        }),

      // Reply actions
      addReply: (imageIndex, commentId, newReply) =>
        set((state) => {
          const updatedImages = [...state.images];
          if (!updatedImages[imageIndex]) return state;

          const commentIndex = updatedImages[imageIndex].comments.findIndex(
            (c) => c.id === commentId
          );

          if (commentIndex === -1) return state;

          updatedImages[imageIndex].comments[commentIndex].replies.push(
            newReply
          );

          return { images: updatedImages };
        }),

      updateReply: (imageIndex, commentId, replyId, newText) =>
        set((state) => {
          const updatedImages = [...state.images];
          if (!updatedImages[imageIndex]) return state;

          const commentIndex = updatedImages[imageIndex].comments.findIndex(
            (c) => c.id === commentId
          );

          if (commentIndex === -1) return state;

          const replyIndex = updatedImages[imageIndex].comments[
            commentIndex
          ].replies.findIndex((r) => r.id === replyId);

          if (replyIndex === -1) return state;

          updatedImages[imageIndex].comments[commentIndex].replies[
            replyIndex
          ].text = newText;

          return { images: updatedImages };
        }),

      deleteReply: (imageIndex, commentId, replyId) =>
        set((state) => {
          const updatedImages = [...state.images];
          if (!updatedImages[imageIndex]) return state;

          const commentIndex = updatedImages[imageIndex].comments.findIndex(
            (c) => c.id === commentId
          );

          if (commentIndex === -1) return state;

          updatedImages[imageIndex].comments[commentIndex].replies =
            updatedImages[imageIndex].comments[commentIndex].replies.filter(
              (r) => r.id !== replyId
            );

          return { images: updatedImages };
        }),
    }),
    {
      name: "image-annotation-storage",
      getStorage: () => localStorage,
    }
  )
);
