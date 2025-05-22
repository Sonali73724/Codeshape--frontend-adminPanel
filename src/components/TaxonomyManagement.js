import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Nav } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaFolder, FaTag } from 'react-icons/fa';
import axios from 'axios';

const TaxonomyManagement = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [itemName, setItemName] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories.json');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('/tags.json');
      setTags(response.data.tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentItem) {
        // Update existing item
        if (activeTab === 'categories') {
          await axios.put(`/api/categories/${currentItem.id}`, { name: itemName });
          fetchCategories();
        } else {
          await axios.put(`/api/tags/${currentItem.id}`, { name: itemName });
          fetchTags();
        }
      } else {
        // Add new item
        if (activeTab === 'categories') {
          await axios.post('/api/categories', { name: itemName });
          fetchCategories();
        } else {
          await axios.post('/api/tags', { name: itemName });
          fetchTags();
        }
      }
      setShowModal(false);
      setItemName('');
      setCurrentItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (activeTab === 'categories') {
        await axios.delete(`/api/categories/${id}`);
        fetchCategories();
      } else {
        await axios.delete(`/api/tags/${id}`);
        fetchTags();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const renderItems = () => {
    const items = activeTab === 'categories' ? categories : tags;
    const Icon = activeTab === 'categories' ? FaFolder : FaTag;

    return (
      <Table responsive hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td><Icon className="me-2" />{item.name}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => {
                  setCurrentItem(item);
                  setItemName(item.name);
                  setShowModal(true);
                }}>
                  <FaEdit /> Edit
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <Nav variant="tabs" defaultActiveKey="categories">
            <Nav.Item>
              <Nav.Link eventKey="categories" onClick={() => setActiveTab('categories')}>Categories</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tags" onClick={() => setActiveTab('tags')}>Tags</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">{activeTab === 'categories' ? 'Categories' : 'Tags'}</h3>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <FaPlus className="me-2" /> New {activeTab === 'categories' ? 'Category' : 'Tag'}
            </Button>
          </div>
          {renderItems()}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setCurrentItem(null);
        setItemName('');
      }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentItem ? `Edit ${activeTab === 'categories' ? 'Category' : 'Tag'}` : `New ${activeTab === 'categories' ? 'Category' : 'Tag'}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                value={itemName} 
                onChange={(e) => setItemName(e.target.value)} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {currentItem ? 'Update' : 'Create'} {activeTab === 'categories' ? 'Category' : 'Tag'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaxonomyManagement;