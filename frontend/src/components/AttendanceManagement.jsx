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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  People,
  Event,
  Add,
} from '@mui/icons-material';
import { attendanceAPI, studentAPI, eventAPI } from '../services/api';

const AttendanceManagement = () => {
  const [attendances, setAttendances] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPresent, setIsPresent] = useState(true);

  useEffect(() => {
    fetchAttendances();
    fetchStudents();
    fetchEvents();
  }, []);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getAll();
      setAttendances(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch attendance records');
      console.error('Error fetching attendances:', err);
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

  const handleMarkAttendance = async () => {
    if (!selectedStudent || !selectedEvent) {
      setError('Please select both student and event');
      return;
    }

    try {
      if (isPresent) {
        await attendanceAPI.markAttendance(selectedStudent.id, selectedEvent.id);
      } else {
        await attendanceAPI.markAbsent(selectedStudent.id, selectedEvent.id);
      }
      setOpen(false);
      setSelectedStudent(null);
      setSelectedEvent(null);
      setIsPresent(true);
      fetchAttendances();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark attendance');
      console.error('Error marking attendance:', err);
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

  const getEventAttendance = (eventId) => {
    return attendances.filter(att => att.event?.id === eventId);
  };

  const getStudentAttendance = (studentId) => {
    return attendances.filter(att => att.student?.id === studentId);
  };

  const getAttendanceStats = (eventId) => {
    const eventAttendances = getEventAttendance(eventId);
    const present = eventAttendances.filter(att => att.isPresent).length;
    const total = eventAttendances.length;
    return { present, total, percentage: total > 0 ? (present / total * 100).toFixed(1) : 0 };
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
          Attendance Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Mark Attendance
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
                Recent Attendance Records
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Event</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendances.slice(0, 10).map((attendance) => (
                      <TableRow key={attendance.id}>
                        <TableCell>
                          {attendance.student?.firstName} {attendance.student?.lastName}
                        </TableCell>
                        <TableCell>{attendance.event?.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={attendance.isPresent ? 'Present' : 'Absent'}
                            color={attendance.isPresent ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(attendance.attendanceTime)}</TableCell>
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
                Event Attendance Summary
              </Typography>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {events.map((event) => {
                  const stats = getAttendanceStats(event.id);
                  return (
                    <Box key={event.id} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {event.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {stats.present} / {stats.total} present ({stats.percentage}%)
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
        <DialogTitle>Mark Attendance</DialogTitle>
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
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPresent}
                    onChange={(e) => setIsPresent(e.target.checked)}
                  />
                }
                label={isPresent ? 'Present' : 'Absent'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleMarkAttendance} variant="contained">
            {isPresent ? 'Mark Present' : 'Mark Absent'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceManagement;
