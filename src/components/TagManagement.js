import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [tagName, setTagName] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      // const response = await axios.get('/api/tags'); // Commented out API route
      const response = await axios.get('/tags.json'); // Fetch from JSON file
      setTags(response.data.tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentTag) {
      // Update existing tag
      setTags(tags.map(tag => tag.id === currentTag.id ? { ...tag, name: tagName } : tag));
    } else {
      // Add new tag
      const newTag = { id: tags.length + 1, name: tagName };
      setTags([...tags, newTag]);
    }
    setShowModal(false);
    setTagName('');
    setCurrentTag(null);
  };

  const handleDelete = (id) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Tags</h3>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" /> New Tag
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.map(tag => (
                <tr key={tag.id}>
                  <td>{tag.name}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => {
                      setCurrentTag(tag);
                      setTagName(tag.name);
                      setShowModal(true);
                    }}>
                      <FaEdit /> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(tag.id)}>
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setCurrentTag(null);
        setTagName('');
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{currentTag ? 'Edit Tag' : 'New Tag'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                value={tagName} 
                onChange={(e) => setTagName(e.target.value)} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {currentTag ? 'Update' : 'Create'} Tag
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TagManagement;