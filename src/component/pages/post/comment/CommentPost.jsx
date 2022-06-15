import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { networkConfig } from "../../../../shared/networkConfig";
function CommentPost({ onCommentPost, onFocus, onBlur }) {
  const [content, setContent] = useState("");

  const handleCreatePost = async (e) => {
    e.preventDefault();
    onCommentPost(content);
  };
  return (
    <div className="fixed-bottom d-flex justify-content-center" style={{ zIndex: "1" }}>
      <form
        className="col-12 col-md-5 d-flex bg-dark p-2"
        onSubmit={handleCreatePost}
        style={{
          alignItems: "flex-end",
          justifyContent: "center",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
        }}
      >
        <textarea
          className="w-100 form-control"
          placeholder=" Write a comment..."
          cols="50"
          rows="2"
          value={content}
          onChange={(e) => {
            e.preventDefault()
            setContent(e.target.value);
          }}
          style={{
            backgroundColor: "#323232",
            color: "white",
            border: "solid 1px #222222",
            resize: "none",
            height: "2.45rem",
            borderRadius: "4px",
          }}
          onFocus={onFocus}
          onBlur={onBlur}
        ></textarea>
        <button className="btn btn-primary ms-1" type="submit">
          <FontAwesomeIcon icon="comment" />
        </button>
      </form>
    </div>
  );
}

export default CommentPost;
