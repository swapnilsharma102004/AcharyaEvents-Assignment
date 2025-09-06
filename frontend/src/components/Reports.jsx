import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Event,
  Star,
  Assessment,
} from '@mui/icons-material';
import { reportsAPI } from '../services/api';

const Reports = () => {
  const [statistics, setStatistics] = useState(null);
  const [eventPopularity, setEventPopularity] = useState([]);
  const [attendanceReports, setAttendanceReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [statsResponse, popularityResponse, attendanceResponse] = await Promise.all([
        reportsAPI.getStatistics(),
        reportsAPI.getEventPopularity(),
        reportsAPI.getAllAttendance(),
      ]);
      
      setStatistics(statsResponse.data);
      setEventPopularity(popularityResponse.data);
      setAttendanceReports(attendanceResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}.main`,
              color: 'white',
              borderRadius: 1,
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  const renderOverview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Events"
          value={statistics?.totalEvents || 0}
          icon={<Event />}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Registrations"
          value={statistics?.totalRegistrations || 0}
          icon={<People />}
          color="secondary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Attendance"
          value={statistics?.totalAttendances || 0}
          icon={<TrendingUp />}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Feedback"
          value={statistics?.totalFeedbacks || 0}
          icon={<Star />}
          color="info"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Attendance Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h3" component="div" sx={{ mr: 2 }}>
                {statistics?.averageAttendanceRate?.toFixed(1) || 0}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={statistics?.averageAttendanceRate || 0}
                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Overall attendance rate across all events
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Health
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip
                label="Online"
                color="success"
                icon={<TrendingUp />}
                sx={{ mr: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                All systems operational
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Last updated: {new Date().toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderEventPopularity = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Event Popularity Report
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Registrations</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>Avg Rating</TableCell>
                <TableCell>Popularity Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventPopularity.map((event, index) => (
                <TableRow key={event.eventId}>
                  <TableCell>{event.eventName}</TableCell>
                  <TableCell>
                    {new Date(event.eventDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={event.registrationCount}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={event.attendanceCount}
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ fontSize: 16, mr: 0.5, color: 'orange' }} />
                      {event.averageRating?.toFixed(1) || 'N/A'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={event.popularityScore?.toFixed(1) || 0}
                      color={index < 3 ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderAttendanceReport = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Attendance Report by Event
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Registrations</TableCell>
                <TableCell>Present</TableCell>
                <TableCell>Absent</TableCell>
                <TableCell>Attendance %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceReports.map((report) => (
                <TableRow key={report.eventId}>
                  <TableCell>{report.eventName}</TableCell>
                  <TableCell>
                    {new Date(report.eventDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{report.totalRegistrations}</TableCell>
                  <TableCell>
                    <Chip
                      label={report.presentAttendances}
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={report.absentCount}
                      color="error"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LinearProgress
                        variant="determinate"
                        value={report.attendancePercentage}
                        sx={{ width: 100, mr: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2">
                        {report.attendancePercentage}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Reports & Analytics
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Report Type</InputLabel>
          <Select
            value={selectedReport}
            label="Report Type"
            onChange={(e) => setSelectedReport(e.target.value)}
          >
            <MenuItem value="overview">Overview</MenuItem>
            <MenuItem value="popularity">Event Popularity</MenuItem>
            <MenuItem value="attendance">Attendance Report</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {selectedReport === 'overview' && renderOverview()}
      {selectedReport === 'popularity' && renderEventPopularity()}
      {selectedReport === 'attendance' && renderAttendanceReport()}
    </Box>
  );
};

export default Reports;
