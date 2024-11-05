import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Fetch posts and user information from the backend
  useEffect(() => {
    axios.get('http://localhost:3000/posts')
      .then(response => {
        console.log('Response from /posts:', response.data); // Debug: Check the data
        setPosts(response.data.posts);
        setUserId(response.data.user_id); // Make sure user_id is being set
        console.log('User ID:', response.data.user_id); // Debug: Log userId
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  // Render
  return (
    <div>
      <h1>Blog Posts</h1>

      {/* Check if userId is truthy */}
      {userId ? (
        <div>
          <button onClick={() => navigate('/create')}>Create New Post</button>
          <button onClick={() => navigate('/logout')}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => navigate('/signin')}>Sign In</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      )}

      <ul>
        {posts.map((post) => (
          <li key={post.blog_id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p>by {post.creator_name}</p>
            {userId === post.creator_user_id && (
              <div>
                <a href={`/edit/${post.blog_id}`}>Edit</a>
                <button onClick={() => handleDelete(post.blog_id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
