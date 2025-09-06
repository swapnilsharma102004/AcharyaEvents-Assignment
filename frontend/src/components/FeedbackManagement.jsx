import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Rating,
  IconButton,
} from '@mui/material';
import {
  Feedback,
  Add,
  Edit,
  Delete,
  Star,
} from '@mui/icons-material';
import { feedbackAPI, studentAPI, eventAPI } from '../services/api';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    student: null,
    event: null,
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    fetchFeedbacks();
    fetchStudents();
    fetchEvents();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getAll();
      setFeedbacks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch feedback');
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getAll();
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleOpen = (feedback = null) => {
    if (feedback) {
      setEditingFeedback(feedback);
      setFormData({
        student: students.find(s => s.id === feedback.student?.id) || null,
        event: events.find(e => e.id === feedback.event?.id) || null,
        rating: feedback.rating,
        comment: feedback.comment,
      });
    } else {
      setEditingFeedback(null);
      setFormData({
        student: null,
        event: null,
        rating: 5,
        comment: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingFeedback(null);
    setFormData({
      student: null,
      event: null,
      rating: 5,
      comment: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStudentChange = (event, newValue) => {
    setFormData({
      ...formData,
      student: newValue,
    });
  };

  const handleEventChange = (event, newValue) => {
    setFormData({
      ...formData,
      event: newValue,
    });
  };

  const handleSubmit = async () => {
    if (!formData.student || !formData.event) {
      setError('Please select both student and event');
      return;
    }

    try {
      if (editingFeedback) {
        await feedbackAPI.update(
          formData.student.id,
          formData.event.id,
          formData.rating,
          formData.comment
        );
      } else {
        await feedbackAPI.submit(
          formData.student.id,
          formData.event.id,
          formData.rating,
          formData.comment
        );
      }
      handleClose();
      fetchFeedbacks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save feedback');
      console.error('Error saving feedback:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedbackAPI.delete(id);
        fetchFeedbacks();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete feedback');
        console.error('Error deleting feedback:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventFeedbacks = (eventId) => {
    return feedbacks.filter(fb => fb.event?.id === eventId);
  };

  const getAverageRating = (eventId) => {
    const eventFeedbacks = getEventFeedbacks(eventId);
    if (eventFeedbacks.length === 0) return 0;
    const sum = eventFeedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / eventFeedbacks.length).toFixed(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Feedback Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Feedback
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Feedback
              </Typography>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {feedbacks.slice(0, 10).map((feedback) => (
                  <Card key={feedback.id} sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1">
                        {feedback.student?.firstName} {feedback.student?.lastName}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpen(feedback)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(feedback.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {feedback.event?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={feedback.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {feedback.rating}/5
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      {feedback.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(feedback.feedbackDate)}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Feedback Summary
              </Typography>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {events.map((event) => {
                  const eventFeedbacks = getEventFeedbacks(event.id);
                  const averageRating = getAverageRating(event.id);
                  return (
                    <Box key={event.id} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {event.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Star sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {averageRating}/5 ({eventFeedbacks.length} reviews)
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={event.eventType}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={event.isActive ? 'Active' : 'Inactive'}
                          color={event.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingFeedback ? 'Edit Feedback' : 'Add New Feedback'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={students}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.studentId})`}
                value={formData.student}
                onChange={handleStudentChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Student"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={events.filter(event => event.isActive)}
                getOptionLabel={(option) => option.name}
                value={formData.event}
                onChange={handleEventChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Event"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, rating: newValue });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingFeedback ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeedbackManagement;
