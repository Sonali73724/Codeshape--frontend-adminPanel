import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaUserTag, FaSave, FaTimes } from 'react-icons/fa';

const AddUserPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding user:', { name, email, role });
    navigate('/users');
  };

  return (
    <div className="container mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h2 className="mb-0">Add New User</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label><FaUser className="me-2" />Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter user's name"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label><FaEnvelope className="me-2" />Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter user's email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label><FaUserTag className="me-2" />Role</Form.Label>
                  <Form.Select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </Form.Select>
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button variant="secondary" className="me-2" onClick={() => navigate('/users')}>
                    <FaTimes className="me-2" />Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    <FaSave className="me-2" />Add User
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddUserPage;