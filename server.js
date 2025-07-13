Creating a full-stack web application for a blog involves setting up a React frontend, a Node.js backend, and a Supabase database schema. Here’s a structured approach to achieve this:

### Project Setup

#### Prerequisites:
- Node.js and npm installed
- Supabase account
- Basic knowledge of JavaScript, React, and SQL

### Supabase Setup

#### 1. Create a Supabase Project:
   - Log in to your Supabase account.
   - Create a new project and grab the API key and project URL for later use.

#### 2. Set Up the Database Schema:
   - Go to the SQL tab and use the following SQL to create tables for posts and comments:

```sql
-- Posts Table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments Table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts (id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Backend (Node.js and Express)

#### 3. Initialize the Node.js Project:
   ```bash
   mkdir blog-backend
   cd blog-backend
   npm init -y
   ```

#### 4. Install Dependencies:
   ```bash
   npm install express cors supabase-js dotenv
   ```

#### 5. Create `index.js` and Set Up Server:
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

app.get('/posts', async (req, res) => {
  const { data, error } = await supabase.from('posts').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/posts', async (req, res) => {
  const { title, content, author } = req.body;
  const { data, error } = await supabase.from('posts').insert([{ title, content, author }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.get('/comments/:postId', async (req, res) => {
  const { postId } = req.params;
  const { data, error } = await supabase.from('comments').select('*').eq('post_id', postId);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/comments', async (req, res) => {
  const { post_id, content, author } = req.body;
  const { data, error } = await supabase.from('comments').insert([{ post_id, content, author }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### React Frontend

#### 6. Create React App:
   ```bash
   npx create-react-app blog-frontend
   cd blog-frontend
   ```

#### 7. Install Dependencies:
   ```bash
   npm install axios
   ```

#### 8. Implement Blog Functionality:

- **Create `src/components/PostList.js`:**
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get('http://localhost:5000/posts');
      setPosts(res.data);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p><em>by {post.author}</em></p>
        </div>
      ))}
    </div>
  );
}

export default PostList;
```

- **Create `src/components/AddPost.js`:**
```javascript
import React, { useState } from 'react';
import axios from 'axios';

const AddPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const submitPost = async () => {
    await axios.post('http://localhost:5000/posts', { title, content, author });
    setTitle('');
    setContent('');
    setAuthor('');
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
      <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
      <button onClick={submitPost}>Submit</button>
    </div>
  );
};

export default AddPost;
```

#### 9. Update `src/App.js` to Integrate Components:
```javascript
import React from 'react';
import './App.css';
import PostList from './components/PostList';
import AddPost from './components/AddPost';

function App() {
  return (
    <div className="App">
      <h1>My Blog</h1>
      <AddPost />
      <PostList />
    </div>
  );
}

export default App;
```

#### 10. Run the Applications:
- **Backend:**
  ```bash
  node index.js
  ```
- **Frontend:**
  ```bash
  npm start
  ```

### Environment Variables
Make sure to create a `.env` file in your backend with the following content:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
PORT=5000
```

### Conclusion

By following these steps, you’ll have a simple yet functional full-stack blog application using React, Node.js, and Supabase. Of course, you can extend and enhance this project with additional features, such as user authentication, advanced querying, or styling with CSS frameworks.