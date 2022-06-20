import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
function CommentPost({ onCommentPost, onFocus, onBlur }) {
  const [content, setContent] = useState("");

  const handleCreatePost = async (e) => {
    e.preventDefault();
    onCommentPost(content);
    setContent("");
  };
  return (
    <div className="comment-post w-100 px-2">
      <form className="flex items-center justify-center bg-white rounded-xl" onSubmit={handleCreatePost}>
        <textarea
          className="w-11/12 lg:w-11/12 resize-none p-2 px-3 rounded-xl"
          placeholder="Write a comment..."
          rows="1"
          value={content}
          onChange={(e) => {
            e.preventDefault();
            setContent(e.target.value);
          }}
          onFocus={onFocus}
          onBlur={onBlur}
        ></textarea>
        <button
          className={content.trim() === "" ? "text-slate-400 w-1/12 lg:w-1/12" : "text-rose-500 md:text-blue-400 w-1/12 lg:w-1/12"}
          type="submit"
        >
          <FontAwesomeIcon icon="comment" />
        </button>
      </form>
    </div>
  );
}

export default CommentPost;
