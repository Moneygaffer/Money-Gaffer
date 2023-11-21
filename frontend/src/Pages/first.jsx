import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Slide,
  Zoom,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";

function First() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgb(0, 7, 61), #2196f3)",
        minHeight: "100vh",
        color: "white",
        minWidth: "100vw",
      }}
    >
      <Slide in direction="down" timeout={1000}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Money Gaffer</Typography>
            <div style={{ flexGrow: 1 }}></div>
            <Link to="/howitworks" style={{ textDecoration: "none" }}>
              <Button color="inherit" style={{ color: "white" }}>
                How it works
              </Button>
            </Link>
            <Button color="inherit">Find savings</Button>
            <Button color="inherit">Contact US</Button>
            <Link to="/blog" style={{ textDecoration: "none" }}>
              <Button color="inherit" style={{ color: "white" }}>
                Blog
              </Button>
            </Link>
            <div style={{ flexGrow: 1 }}></div>
            <Link to="/Login" style={{ textDecoration: "none" }}>
              <Button color="inherit" style={{ color: "white" }}>
                Login
              </Button>
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Button color="inherit" style={{ color: "white" }}>
                SignUp
              </Button>
            </Link>
          </Toolbar>
        </AppBar>
      </Slide>

      <Container style={{ textAlign: "center", paddingTop: "50px" }}>
        <Zoom in timeout={1000}>
          <Typography variant="h3" gutterBottom>
            Your Financial Management Solution
          </Typography>
        </Zoom>
        <Zoom in timeout={1500}>
          <Typography variant="h6" gutterBottom>
            Welcome to Money Gaffer, your trusted partner in managing finances
            and achieving financial success.
          </Typography>
        </Zoom>
      </Container>

      <Container style={{ textAlign: "center", marginTop: "50px" }}>
        <Typography variant="h4" gutterBottom>
          Have Questions? We Can Help.
        </Typography>
      </Container>

      <Container style={{ textAlign: "center", marginTop: "50px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Slide in direction="up" timeout={1000}>
              <Paper
                elevation={3}
                style={{
                  padding: "20px",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h5">Budgets? You Betcha</Typography>
                <Typography variant="body1">
                  Effortlessly create budgets that are easy to stick to. We even
                  make a few for you.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
          <Grid item xs={12} md={4}>
            <Slide in direction="up" timeout={1500}>
              <Paper
                elevation={3}
                style={{
                  padding: "20px",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h5">ALL-in-One Done?</Typography>
                <Typography variant="body1">
                  From money and budgeting to customized tips and more, get a
                  clear view of your total financial life.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
          <Grid item xs={12} md={4}>
            <Slide in direction="up" timeout={2000}>
              <Paper
                elevation={3}
                style={{
                  padding: "20px",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h5">Credit? Checked</Typography>
                <Typography variant="body1">
                  Find out yours and learn how you can improve it.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
        </Grid>
      </Container>

      <Container style={{ textAlign: "center", marginTop: "50px" }}>
        <Typography variant="body2" gutterBottom>
          &copy; {new Date().getFullYear()} Money Gaffer. All Rights Reserved.
        </Typography>
      </Container>

      <Container style={{ textAlign: "center", marginTop: "50px" }}>
        <Zoom in timeout={2500}>
          <Typography variant="h4" gutterBottom>
            Join us today and take control of your finances!
          </Typography>
        </Zoom>
        <Zoom in timeout={3000}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ marginTop: "20px" }}
          >
            Get Started
          </Button>
        </Zoom>
      </Container>

      <Outlet />
    </div>
  );
}

export default First;
