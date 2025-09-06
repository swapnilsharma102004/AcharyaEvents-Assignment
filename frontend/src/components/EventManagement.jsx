import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Event,
  Search,
  LocationOn,
  People,
  Schedule,
} from '@mui/icons-material';
import { eventAPI, collegeAPI } from '../services/api';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventDate: '',
    location: '',
    maxCapacity: '',
    eventType: '',
    isActive: true,
    college: null,
  });

  const eventTypes = ['Conference', 'Workshop', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Other'];

  useEffect(() => {
    fetchEvents();
    fetchColleges();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let response;
      if (filterType === 'active') {
        response = await eventAPI.getActive();
      } else if (filterType === 'available') {
        response = await eventAPI.getAvailable();
      } else {
        response = await eventAPI.getAll();
      }
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchColleges = async () => {
    try {
      const response = await collegeAPI.getAll();
      setColleges(response.data);
    } catch (err) {
      console.error('Error fetching colleges:', err);
    }
  };

  const handleOpen = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        ...event,
        eventDate: event.eventDate ? event.eventDate.split('T')[0] + 'T' + event.eventDate.split('T')[1].substring(0, 5) : '',
        college: colleges.find(c => c.id === event.college?.id) || null,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        name: '',
        description: '',
        eventDate: '',
        location: '',
        maxCapacity: '',
        eventType: '',
        isActive: true,
        college: null,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEvent(null);
    setFormData({
      name: '',
      description: '',
      eventDate: '',
      location: '',
      maxCapacity: '',
      eventType: '',
      isActive: true,
      college: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCollegeChange = (event, newValue) => {
    setFormData({
      ...formData,
      college: newValue,
    });
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        college: { id: formData.college.id },
        maxCapacity: parseInt(formData.maxCapacity),
      };
      
      if (editingEvent) {
        await eventAPI.update(editingEvent.id, submitData);
      } else {
        await eventAPI.create(submitData);
      }
      handleClose();
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save event');
      console.error('Error saving event:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.delete(id);
        fetchEvents();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete event');
        console.error('Error deleting event:', err);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchEvents();
      return;
    }
    
    try {
      setLoading(true);
      const response = await eventAPI.search(searchQuery);
      setEvents(response.data);
    } catch (err) {
      setError('Failed to search events');
      console.error('Error searching events:', err);
    } finally {
      setLoading(false);
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

  const filteredEvents = events.filter(event =>
    !searchQuery || 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.eventType.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          Event Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Event
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          placeholder="Search events by name, description, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ minWidth: 300 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterType}
            label="Filter"
            onChange={(e) => {
              setFilterType(e.target.value);
              fetchEvents();
            }}
          >
            <MenuItem value="all">All Events</MenuItem>
            <MenuItem value="active">Active Events</MenuItem>
            <MenuItem value="available">Available Events</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Event sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {event.name}
                  </Typography>
                  <Chip
                    label={event.isActive ? 'Active' : 'Inactive'}
                    color={event.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Schedule sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(event.eventDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.currentRegistrations}/{event.maxCapacity} registered
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={event.eventType} size="small" />
                  <Chip label={event.college?.name || 'N/A'} size="small" variant="outlined" />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleOpen(event)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredEvents.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {searchQuery ? 'No events found matching your search.' : 'No events found. Add your first event to get started.'}
          </Typography>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingEvent ? 'Edit Event' : 'Add New Event'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={colleges}
                getOptionLabel={(option) => option.name}
                value={formData.college}
                onChange={handleCollegeChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="College"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={formData.eventType}
                  label="Event Type"
                  onChange={handleChange}
                  name="eventType"
                >
                  {eventTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Event Date & Time"
                name="eventDate"
                type="datetime-local"
                value={formData.eventDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Capacity"
                name="maxCapacity"
                type="number"
                value={formData.maxCapacity}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleChange}
                    name="isActive"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEvent ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventManagement;
