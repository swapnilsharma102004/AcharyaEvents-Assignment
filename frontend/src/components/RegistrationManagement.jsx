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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Assignment,
  Add,
  Cancel,
  People,
  Event,
} from '@mui/icons-material';
import { registrationAPI, studentAPI, eventAPI } from '../services/api';

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchRegistrations();
    fetchStudents();
    fetchEvents();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await registrationAPI.getAll();
      setRegistrations(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch registrations');
      console.error('Error fetching registrations:', err);
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

  const handleRegister = async () => {
    if (!selectedStudent || !selectedEvent) {
      setError('Please select both student and event');
      return;
    }

    try {
      await registrationAPI.register(selectedStudent.id, selectedEvent.id);
      setOpen(false);
      setSelectedStudent(null);
      setSelectedEvent(null);
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register student');
      console.error('Error registering student:', err);
    }
  };

  const handleCancelRegistration = async (studentId, eventId) => {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      try {
        await registrationAPI.cancel(studentId, eventId);
        fetchRegistrations();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to cancel registration');
        console.error('Error canceling registration:', err);
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

  const getEventRegistrations = (eventId) => {
    return registrations.filter(reg => reg.event?.id === eventId);
  };

  const getStudentRegistrations = (studentId) => {
    return registrations.filter(reg => reg.student?.id === studentId);
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
          Registration Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Register Student
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
                Recent Registrations
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Event</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {registrations.slice(0, 10).map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>
                          {registration.student?.firstName} {registration.student?.lastName}
                        </TableCell>
                        <TableCell>{registration.event?.name}</TableCell>
                        <TableCell>{formatDate(registration.registrationDate)}</TableCell>
                        <TableCell>
                          <Chip
                            label={registration.isConfirmed ? 'Confirmed' : 'Pending'}
                            color={registration.isConfirmed ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleCancelRegistration(
                              registration.student?.id,
                              registration.event?.id
                            )}
                          >
                            <Cancel />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Registration Summary
              </Typography>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {events.map((event) => {
                  const eventRegistrations = getEventRegistrations(event.id);
                  return (
                    <Box key={event.id} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {event.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {eventRegistrations.length} / {event.maxCapacity} registered
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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register Student for Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={students}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.studentId})`}
                value={selectedStudent}
                onChange={(event, newValue) => setSelectedStudent(newValue)}
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
                value={selectedEvent}
                onChange={(event, newValue) => setSelectedEvent(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Event"
                    required
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleRegister} variant="contained">
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegistrationManagement;
