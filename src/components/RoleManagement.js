import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: '', permissions: {} });
  const [editingRole, setEditingRole] = useState(null);

  const permissions = [
    'Add Post',
    'Edit Post',
    'Delete Post',
    'Publish Post',
    'Manage Users',
    'Manage Roles',
    'Access Settings'
  ];

  useEffect(() => {
    // Fetch roles from API or load from local storage
    const savedRoles = JSON.parse(localStorage.getItem('roles')) || [];
    setRoles(savedRoles);
  }, []);

  useEffect(() => {
    // Save roles to local storage whenever they change
    localStorage.setItem('roles', JSON.stringify(roles));
  }, [roles]);

  const handlePermissionChange = (permission, isChecked, roleToUpdate = newRole) => {
    const updatedRole = {
      ...roleToUpdate,
      permissions: { ...roleToUpdate.permissions, [permission]: isChecked }
    };
    if (roleToUpdate === newRole) {
      setNewRole(updatedRole);
    } else {
      setEditingRole(updatedRole);
    }
  };

  const handleAddRole = () => {
    if (newRole.name) {
      setRoles([...roles, newRole]);
      setNewRole({ name: '', permissions: {} });
    }
  };

  const handleEditRole = (role) => {
    setEditingRole({ ...role });
  };

  const handleUpdateRole = () => {
    if (editingRole) {
      setRoles(roles.map(role => role.name === editingRole.name ? editingRole : role));
      setEditingRole(null);
    }
  };

  const handleDeleteRole = (roleName) => {
    setRoles(roles.filter(role => role.name !== roleName));
  };

  const renderPermissionCheckboxes = (role, onChange) => {
    return permissions.map(permission => (
      <Form.Check
        key={permission}
        type="checkbox"
        label={permission}
        checked={role.permissions[permission] || false}
        onChange={(e) => onChange(permission, e.target.checked, role)}
      />
    ));
  };

  return (
    <Container fluid className="mt-4">
      <h1 className="mb-4">Role Management</h1>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>{editingRole ? 'Edit Role' : 'Add New Role'}</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Role Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingRole ? editingRole.name : newRole.name}
                    onChange={(e) => editingRole ? setEditingRole({...editingRole, name: e.target.value}) : setNewRole({...newRole, name: e.target.value})}
                    placeholder="Enter role name"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Permissions</Form.Label>
                  {renderPermissionCheckboxes(editingRole || newRole, handlePermissionChange)}
                </Form.Group>
                <Button variant="primary" onClick={editingRole ? handleUpdateRole : handleAddRole} className="mt-3">
                  {editingRole ? 'Update Role' : 'Add Role'}
                </Button>
                {editingRole && (
                  <Button variant="secondary" onClick={() => setEditingRole(null)} className="mt-3 ms-2">
                    Cancel
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Existing Roles</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Role Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map(role => (
                    <tr key={role.name}>
                      <td>{role.name}</td>
                      <td>
                        <Button variant="info" size="sm" onClick={() => handleEditRole(role)} className="me-2">
                          <FaEdit /> Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteRole(role.name)}>
                          <FaTrash /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RoleManagement;