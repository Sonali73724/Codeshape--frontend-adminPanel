import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaFolder } from 'react-icons/fa';
import axios from 'axios';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories.json');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCategory) {
        // Update existing category
        await axios.put(`/api/categories/${currentCategory.id}`, { name: categoryName });
      } else {
        // Add new category
        await axios.post('/api/categories', { name: categoryName });
      }
      fetchCategories();
      setShowModal(false);
      setCategoryName('');
      setCurrentCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Categories</h3>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" /> New Category
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
              {categories.map(category => (
                <tr key={category.id}>
                  <td><FaFolder className="me-2" />{category.name}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => {
                      setCurrentCategory(category);
                      setCategoryName(category.name);
                      setShowModal(true);
                    }}>
                      <FaEdit /> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(category.id)}>
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
        setCurrentCategory(null);
        setCategoryName('');
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{currentCategory ? 'Edit Category' : 'New Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                value={categoryName} 
                onChange={(e) => setCategoryName(e.target.value)} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {currentCategory ? 'Update' : 'Create'} Category
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CategoryManagement;