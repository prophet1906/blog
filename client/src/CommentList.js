import React, {useState, useCallback, useEffect} from "react";
import axios from "axios";

export default ({postId}) => {
  const [comments, setComments] = useState([]);

  const fetchData = useCallback(async () => {
    const res = await axios.get(
      `http://localhost:8081/posts/${postId}/comments`
    );

    setComments(res.data);
  }, [postId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};
