import React from 'react';
import { Container, Paper, Avatar, Typography, Grid, MenuItem, Button,TextField } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const ProfilePage = () => {
  // Sample user data
  const username = 'John Doe';
  const email = 'johndoe@example.com';
  const dob = '1990-01-01';
  const gender = 'Male';

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} align="center">
            <Avatar style={{ backgroundColor: '#3f51b5', width: '100px', height: '100px' }}>
              <LockIcon style={{ fontSize: '48px' }} />
            </Avatar>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography variant="h4">{username}</Typography>
          </Grid>
        </Grid>
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">User Information:</Typography>
          <Typography variant="body1">Email: {email}</Typography>
          <Typography variant="body1">Date of Birth: {dob}</Typography>
          <Typography variant="body1">Gender: {gender}</Typography>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Change Password:</Typography>
          {/* Add password change form here */}
          <TextField
            label="New Password"
            fullWidth
            type="password"
            required
          />
          <TextField
            label="Confirm Password"
            fullWidth
            type="password"
            required
          />
          <Button variant="contained" color="primary" fullWidth>
            Change Password
          </Button>
        </div>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
