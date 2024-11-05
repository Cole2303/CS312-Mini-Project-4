import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Edit = () => {
  const { id } = useParams();
  const [post, setPost] = useState({ title: '', body: '' });

  useEffect(() => {
    // Fetch post data to edit
    axios.get(`http://localhost:3000/posts/${id}`)
      .then(response => setPost(response.data))
      .catch(error => console.error('Error fetching post:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  return (
    <form action={`/edit/${id}`} method="post">
      <h1>Edit Post</h1>
      <label>Title:</label>
      <input
        type="text"
        name="title"
        value={post.title}
        onChange={handleChange}
        required
      />
      <label>Message:</label>
      <textarea
        name="body"
        value={post.body}
        onChange={handleChange}
        required
      ></textarea>
      <button type="submit">Update</button>
    </form>
  );
};

export default Edit;
