import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Table, Form, Badge } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import { FaEye, FaThumbsUp, FaComment, FaShare, FaGlobe, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
const PostReports = () => {
  const [postsData, setPostsData] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    fetchPostsData();
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedPost) {
      createChart();
    }
  }, [selectedPost]);

  const fetchPostsData = async () => {
    try {
      // In a real application, replace this with an actual API call
      const response = await axios.get('/postsData.json');
      setPostsData(response.data);
      if (response.data.posts.length > 0) {
        setSelectedPost(response.data.posts[0]);
      }
    } catch (error) {
      console.error('Error fetching posts data:', error);
    }
  };

  const createChart = () => {
    const ctx = chartRef.current.getContext('2d');
    
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: selectedPost.dailyStats.map(stat => stat.date),
        datasets: [
          {
            label: 'Views',
            data: selectedPost.dailyStats.map(stat => stat.views),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Likes',
            data: selectedPost.dailyStats.map(stat => stat.likes),
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          },
          {
            label: 'Comments',
            data: selectedPost.dailyStats.map(stat => stat.comments),
            borderColor: 'rgb(255, 205, 86)',
            tension: 0.1
          },
          {
            label: 'Shares',
            data: selectedPost.dailyStats.map(stat => stat.shares),
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1
          },
          {
            label: 'Social Media Shares',
            data: selectedPost.dailyStats.map(stat => stat.socialShares),
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  if (!postsData) return <div>Loading...</div>;

  const handlePostChange = (e) => {
    const post = postsData.posts.find(p => p.id === parseInt(e.target.value));
    setSelectedPost(post);
  };

  return (
      <Container fluid className="py-4">
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <h1 className="mb-4 text-primary">
              <FaChartLine className="me-2" />
              Post Performance Reports
            </h1>
      
            <Form.Group className="mb-4">
              <Form.Label><strong>Select Post</strong></Form.Label>
              <Form.Control 
                as="select" 
                onChange={handlePostChange} 
                value={selectedPost?.id}
                className="form-select-lg"
              >
                {postsData.posts.map(post => (
                  <option key={post.id} value={post.id}>{post.title}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Card.Body>
        </Card>
      
        {selectedPost && (
          <Row className="g-4">
            <Col lg={8}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title className="mb-4">
                    <FaChartLine className="me-2" />
                    Daily Performance Trends
                  </Card.Title>
                  <div style={{ height: '400px' }}>
                    <canvas ref={chartRef}></canvas>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title className="mb-4">Performance Summary</Card.Title>
                  <Row className="g-3">
                    {[
                      { title: "Total Views", icon: FaEye, value: selectedPost.totalViews, color: "primary" },
                      { title: "Total Likes", icon: FaThumbsUp, value: selectedPost.totalLikes, color: "success" },
                      { title: "Total Comments", icon: FaComment, value: selectedPost.totalComments, color: "info" },
                      { title: "Total Shares", icon: FaShare, value: selectedPost.totalShares, color: "warning" },
                      { title: "Social Media Shares", icon: FaGlobe, value: selectedPost.totalSocialShares, color: "danger" }
                    ].map((item, index) => (
                      <Col key={index} xs={6}>
                        <div className={`d-flex align-items-center p-3 bg-light rounded-3 border-start border-5 border-${item.color}`}>
                          <item.icon className={`me-3 text-${item.color}`} size={24} />
                          <div>
                            <div className="small text-muted">{item.title}</div>
                            <div className="fs-5 fw-bold">{item.value}</div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      
        {selectedPost && (
          <Card className="shadow-sm mt-4">
            <Card.Body>
              <Card.Title className="mb-4">
                <FaChartLine className="me-2" />
                Detailed Daily Statistics
              </Card.Title>
              <div className="table-responsive">
                <Table striped bordered hover size="sm">
                  <thead className="bg-light">
                    <tr>
                      <th>Date</th>
                      <th>Views</th>
                      <th>Likes</th>
                      <th>Comments</th>
                      <th>Shares</th>
                      <th>Social Shares</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPost.dailyStats.map((stat, index) => (
                      <tr key={index}>
                        <td>{stat.date}</td>
                        <td><Badge bg="primary" pill>{stat.views}</Badge></td>
                        <td><Badge bg="success" pill>{stat.likes}</Badge></td>
                        <td><Badge bg="info" pill>{stat.comments}</Badge></td>
                        <td><Badge bg="warning" pill>{stat.shares}</Badge></td>
                        <td><Badge bg="danger" pill>{stat.socialShares}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
  );
};

export default PostReports;