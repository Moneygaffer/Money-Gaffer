import React from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Slide,
  Zoom,
  Button,
} from "@mui/material";
import { Outlet } from "react-router-dom";

function First1() {
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
        <Container style={{ paddingTop: "50px", textAlign: "center" }}>
          <Zoom in timeout={1000}>
            <Typography variant="h3" gutterBottom>
              How Money Gaffer Works
            </Typography>
          </Zoom>
          <Zoom in timeout={1500}>
            <Typography variant="h6" gutterBottom>
              Discover the power of personal finance management with Money
              Gaffer.
            </Typography>
          </Zoom>
        </Container>
      </Slide>

      <Container style={{ marginTop: "50px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Slide in direction="left" timeout={1000}>
              <Paper
                elevation={3}
                style={{ padding: "20px", textAlign: "center" }}
              >
                <Typography variant="h5">Expense Tracking</Typography>
                <Typography variant="body1">
                  Easily keep track of your daily expenses and categorize them
                  for a clear overview of your spending habits.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
          <Grid item xs={12} md={6}>
            <Slide in direction="right" timeout={1000}>
              <Paper
                elevation={3}
                style={{ padding: "20px", textAlign: "center" }}
              >
                <Typography variant="h5">Income Management</Typography>
                <Typography variant="body1">
                  Record your income sources, set financial goals, and monitor
                  your progress towards achieving them.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
        </Grid>
      </Container>

      <Container style={{ marginTop: "50px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Slide in direction="left" timeout={1000}>
              <Paper
                elevation={3}
                style={{ padding: "20px", textAlign: "center" }}
              >
                <Typography variant="h5">Savings Tracking</Typography>
                <Typography variant="body1">
                  Plan and track your savings goals, whether it's for a
                  vacation, emergency fund, or retirement, and ensure you stay
                  on target.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
          <Grid item xs={12} md={6}>
            <Slide in direction="right" timeout={1000}>
              <Paper
                elevation={3}
                style={{ padding: "20px", textAlign: "center" }}
              >
                <Typography variant="h5">Insurance Management</Typography>
                <Typography variant="body1">
                  Manage your health and vehicle insurance policies, including
                  premiums, coverage details, and renewal dates.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
        </Grid>
      </Container>

      <Container style={{ marginTop: "50px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Slide in direction="left" timeout={1000}>
              <Paper
                elevation={3}
                style={{ padding: "20px", textAlign: "center" }}
              >
                <Typography variant="h5">Loan Tracking</Typography>
                <Typography variant="body1">
                  Keep track of your loans, their terms, and repayment schedules
                  to ensure you meet your financial obligations.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
          <Grid item xs={12} md={6}>
            <Slide in direction="right" timeout={1000}>
              <Paper
                elevation={3}
                style={{ padding: "20px", textAlign: "center" }}
              >
                <Typography variant="h5">Investment Management</Typography>
                <Typography variant="body1">
                  Monitor your investments, including stocks, mutual funds, and
                  other financial assets, and make informed decisions.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
        </Grid>
      </Container>

      <Slide in direction="up" timeout={1000}>
        <Container style={{ textAlign: "center", marginTop: "50px" }}>
          <Typography variant="body2">
            Money Gaffer provides a comprehensive solution for all your personal
            finance needs, empowering you to take control of your financial
            future.
          </Typography>
        </Container>
      </Slide>

      <Slide in direction="up" timeout={1500}>
        <Container style={{ textAlign: "center", marginTop: "50px" }}>
          <Typography variant="h4" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="body2">
            Join us today and begin your journey towards financial success.
          </Typography>
        </Container>
      </Slide>

      <Slide in direction="up" timeout={2000}>
        <Container style={{ textAlign: "center", marginTop: "20px" }}>
          <Button variant="contained" color="primary" size="large">
            Get Started
          </Button>
        </Container>
      </Slide>

      <Outlet />
    </div>
  );
}

export default First1;
