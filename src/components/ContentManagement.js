import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Row, Col, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaFolder } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';


const ContentManagement = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchCategories = async () => {
    try {
    //  const response = await axios.get('/api/categories');
      const response = await axios.get('/categories.json');

      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handlePostSubmit = async (post) => {
    try {
      if (post.id) {
        await axios.put(`/api/posts/${post.id}`, post);
      } else {
        await axios.post('/api/posts', post);
      }
      fetchPosts();
      setShowPostModal(false);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleCategorySubmit = async (category) => {
    try {
      if (category.id) {
        await axios.put(`/api/categories/${category.id}`, category);
      } else {
        await axios.post('/api/categories', category);
      }
      fetchCategories();
      setShowCategoryModal(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`/api/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Posts</h3>
              <Link to="/newPost">
                <Button variant="primary">
                  New Post
                </Button>
              </Link>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id}>
                      <td>{post.title}</td>
                      <td>{post.category}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => {
                          setCurrentPost(post);
                          setShowPostModal(true);
                        }}>
                          <FaEdit /> Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeletePost(post.id)}>
                          <FaTrash /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {/* for demo , remove when backend ready */}
                  <tr>
                    <td>This is title</td>
                    <td>Category 1</td>
                    <td>
                      <Button variant="outline-danger" size="sm" className="me-2">
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        Delete
                      </Button>
                    </td>

                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Categories</h3>
              <Button variant="primary" onClick={() => {
                setCurrentCategory(null);
                setShowCategoryModal(true);
              }}>
                <FaPlus className="me-2" /> New Category
              </Button>
            </Card.Header>
            <Card.Body>
              <ul className="list-group">
                {categories.map(category => (
                  <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span><FaFolder className="me-2" />{category.name}</span>
                    <div>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => {
                        setCurrentCategory(category);
                        setShowCategoryModal(true);
                      }}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <PostModal
        show={showPostModal}
        handleClose={() => setShowPostModal(false)}
        handleSubmit={handlePostSubmit}
        post={currentPost}
        categories={categories}
      />

      <CategoryModal
        show={showCategoryModal}
        handleClose={() => setShowCategoryModal(false)}
        handleSubmit={handleCategorySubmit}
        category={currentCategory}
      />
    </div>
  );
};

const PostModal = ({ show, handleClose, handleSubmit, post, categories }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
    } else {
      setTitle('');
      setContent('');
      setCategory('');
    }
  }, [post]);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ id: post ? post.id : null, title, content, category });
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{post ? 'Edit Post' : 'New Post'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control as="textarea" rows={5} value={content} onChange={(e) => setContent(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            {post ? 'Update' : 'Create'} Post
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const CategoryModal = ({ show, handleClose, handleSubmit, category }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName('');
    }
  }, [category]);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ id: category ? category.id : null, name });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{category ? 'Edit Category' : 'New Category'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit">
            {category ? 'Update' : 'Create'} Category
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ContentManagement;