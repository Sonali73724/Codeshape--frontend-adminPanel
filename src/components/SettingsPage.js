import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import axios from 'axios';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    siteTitle: '',
    siteLogo: '',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    itemsPerPage: 10,
    theme: 'light',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // backend endpoint to fetch settings
      // const response = await axios.get('/api/settings');
      const response = await axios.get('/settings.json'); // Fetch from JSON file
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSettings(prevSettings => ({
      ...prevSettings,
      siteLogo: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real application, you would send these settings to your backend
      await axios.post('/api/settings', settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h2" className="text-center bg-primary text-white">
          Settings & Configuration
        </Card.Header>
        <Card.Body>
          {savedSuccess && (
            <Alert variant="success" className="mb-3">
              Settings saved successfully!
            </Alert>
          )}
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Site Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="siteTitle"
                    value={settings.siteTitle}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Site Logo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4 className="mt-4">Email SMTP Configuration</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SMTP Host</Form.Label>
                  <Form.Control
                    type="text"
                    name="smtpHost"
                    value={settings.smtpHost}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SMTP Port</Form.Label>
                  <Form.Control
                    type="number"
                    name="smtpPort"
                    value={settings.smtpPort}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SMTP Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="smtpUser"
                    value={settings.smtpUser}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SMTP Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="smtpPass"
                    value={settings.smtpPass}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4 className="mt-4">Other Settings</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Items Per Page</Form.Label>
                  <Form.Control
                    type="number"
                    name="itemsPerPage"
                    value={settings.itemsPerPage}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Theme</Form.Label>
                  <Form.Select
                    name="theme"
                    value={settings.theme}
                    onChange={handleInputChange}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="primary" type="submit">
                <FaSave className="me-2" />
                Save Settings
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SettingsPage;