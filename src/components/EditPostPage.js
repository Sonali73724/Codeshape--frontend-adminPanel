import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const EditPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Fetch post data from a JSON file (simulating API call)
    fetch('/post.json')
      .then(response => response.json())
      .then(data => {
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
        setTags(data.tags);
      })
      .catch(error => console.error('Error fetching post:', error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPost = { ...post, title, content, category, tags };
    console.log('Updated post:', updatedPost);
    // Here you would typically send the updated post to your API
    // For now, we'll just log it to the console
    
    // Commented out API call:
    // try {
    //   await axios.put(`/api/posts/${id}`, updatedPost);
    //   // Handle successful update (e.g., show a success message, redirect)
    // } catch (error) {
    //   console.error('Error updating post:', error);
    //   // Handle error (e.g., show error message)
    // }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h2>Edit Post</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={5} 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control 
                type="text" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control 
                type="text" 
                value={tags.join(', ')} 
                onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))} 
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Post
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditPostPage;