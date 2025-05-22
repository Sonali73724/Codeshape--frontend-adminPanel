import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaSave, FaUpload, FaTimes } from 'react-icons/fa';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const NewPostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const imageRef = useRef(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    initTinyMCE();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories.json');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const initTinyMCE = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${process.env.PUBLIC_URL}/tinymce/tinymce.min.js`;
      script.onload = () => {
        window.tinymce.init({
          selector: '#content-editor',
          height: 500,
          toolbar: 'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help',
          setup: (editor) => {
            editorRef.current = editor;
            editor.on('change', () => {
              setContent(editor.getContent());
            });
          },
          init_instance_callback: (editor) => {
            resolve(editor);
          }
        });
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.body.appendChild(script);
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setShowMediaModal(true);
    }
  };

  const handleCropComplete = (crop) => {
    makeClientCrop(crop);
  };

  const makeClientCrop = async (crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        'cropped.jpg'
      );
      setCroppedImageUrl(croppedImageUrl);
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        const croppedImageUrl = window.URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, 'image/jpeg');
    });
  };

  const handleSubmit = async (e, publish = false) => {
    e.preventDefault();
    setIsPublishing(publish);

    try {
      const postData = {
        title,
        content,
        category,
        status: publish ? 'published' : 'draft',
        featuredImage: croppedImageUrl,
      };

      console.log('New post data:', postData);
      alert(publish ? 'Post published successfully!' : 'Post saved as draft!');
      navigate('/content-management');
    } catch (error) {
      console.error('Error creating post:', error);
      setIsPublishing(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h2" className="text-center bg-primary text-white">
          Create New Post
        </Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => handleSubmit(e, true)}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <textarea
                id="content-editor"
                className="form-control"
                rows="10"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Featured Image</Form.Label>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="fileInput"
                />
                <Button
                  variant="secondary"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <FaUpload className="me-2" />
                  Upload Image
                </Button>
              </div>
              {croppedImageUrl && (
                <img
                  src={croppedImageUrl}
                  alt="Cropped preview"
                  style={{ maxWidth: '100%', marginTop: '10px' }}
                />
              )}
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button
                variant="secondary"
                onClick={(e) => handleSubmit(e, false)}
                disabled={isPublishing}
              >
                <FaSave className="me-2" />
                Save as Draft
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isPublishing}
              >
                <FaPaperPlane className="me-2" />
                Publish Post
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Modal show={showMediaModal} onHide={() => setShowMediaModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewImage && (
            <ReactCrop
              src={previewImage}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={handleCropComplete}
            >
              <img ref={imageRef} src={previewImage} alt="Preview" />
            </ReactCrop>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMediaModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowMediaModal(false);
            }}
          >
            Apply Crop
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NewPostPage;