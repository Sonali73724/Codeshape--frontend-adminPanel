import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Card, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users.json');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async (user) => {
    try {
      setUsers([...users, { ...user, id: users.length + 1 }]);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Users</h2>
            <div>
              <Button variant="primary" onClick={() => setShowAddModal(true)} className="me-2">
                <FaUserPlus className="me-2" /> Add User
              </Button>
              <Link to="/users/add" className="btn btn-outline-primary">
                <FaUserPlus className="me-2" /> Add User (Page)
              </Link>
            </div>
          </div>
          <Table responsive hover className="align-middle">
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.role === 'Admin' ? 'danger' : 'success'} pill>
                      {user.role}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-info" size="sm" onClick={() => {
                      setCurrentUser(user);
                      setShowEditModal(true);
                    }} className="me-2">
                      <FaEdit /> Edit
                    </Button>
                    <Link to={`/users/edit/${user.id}`} className="btn btn-outline-warning btn-sm me-2">
                      <FaEdit /> Edit (Page)
                    </Link>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <AddUserModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleAddUser={handleAddUser}
      />

      <EditUserModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        handleEditUser={handleEditUser}
        user={currentUser}
      />
    </div>
  );
};
const AddUserModal = ({ show, handleClose, handleAddUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddUser({ name, email, role });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Add User
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const EditUserModal = ({ show, handleClose, handleEditUser, user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditUser({ id: user.id, name, email, role });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Update User
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Users;