import React from "react";
import {
  Container,
  Typography,
  Paper,
  Slide,
  Zoom,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";

const RootPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const Author = styled(Typography)(({ theme }) => ({
  color: "gray",
  marginBottom: theme.spacing(2),
}));

const Content = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const Blog = () => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgb(0, 7, 61), #2196f3)",
        minHeight: "100vh",
        color: "white",
        minWidth: "100vw",
      }}
    >
      <Container maxWidth="md">
        <Slide in direction="down" timeout={1000}>
          <RootPaper elevation={3}>
            <Title variant="h2">BUSINESS IDEAS ARTICLE</Title>
            <Author variant="body1">by Nicole Martins Ferreira</Author>
            <Content variant="body1">
              Find a list of 33 small business ideas that’ll make you money in
              2024. Thousands of entrepreneurs have implemented them…
            </Content>
          </RootPaper>
        </Slide>

        <Slide in direction="down" timeout={1500}>
          <RootPaper elevation={3}>
            <Title variant="h2">BUSINESS IDEAS ARTICLE</Title>
            <Author variant="body1">by Adeel Qayum</Author>
            <Content variant="body1">
              Wholesale Clothing Vendors: The 14 Best Options In 2023. Discover
              the top 14 wholesale clothing vendors in 2023. Kickstart your
              clothing business with the best bulk buying options.
            </Content>
          </RootPaper>
        </Slide>

        <Slide in direction="down" timeout={2000}>
          <RootPaper elevation={3}>
            <Title variant="h2">BUSINESS IDEAS ARTICLE</Title>
            <Author variant="body1">by Adeel Qayum</Author>
            <Content variant="body1">
              Inventory Turnover Ratio: How to Calculate and Improve It (2023)
              Learn how the inventory turnover ratio impacts your business.
              Uncover its formula and actionable steps to enhance ITR o…
            </Content>
          </RootPaper>
        </Slide>

        <Slide in direction="down" timeout={2500}>
          <RootPaper elevation={3}>
            <Title variant="h2">BUSINESS IDEAS ARTICLE</Title>
            <Author variant="body1">by Adeel Qayum</Author>
            <Content variant="body1">
              Angel Investors: Definition and Tips to Attract Them Learn all
              about angel investors and how to make a lasting impression.
              Uncover the secrets to transform their interest i…
            </Content>
          </RootPaper>
        </Slide>
        <Slide in direction="down" timeout={3000}>
          <RootPaper elevation={3}>
            <Title variant="h2">BUSINESS IDEAS ARTICLE</Title>
            <Author variant="body1">by John Smith</Author>
            <Content variant="body1">
              Top 10 E-Commerce Trends to Watch Out For in 2024 Stay ahead of
              the competition with insights into the latest e-commerce trends
              and strategies for the upcoming year.
            </Content>
          </RootPaper>
        </Slide>

        <Slide in direction="down" timeout={3500}>
          <RootPaper elevation={3}>
            <Title variant="h2">FINANCIAL PLANNING GUIDE</Title>
            <Author variant="body1">by Sarah Johnson</Author>
            <Content variant="body1">
              5 Steps to Achieving Financial Freedom Discover a step-by-step
              guide to take control of your finances and work towards achieving
              financial freedom.
            </Content>
          </RootPaper>
        </Slide>

        {/* Add more blog posts here */}
      </Container>
    </div>
  );
};

export default Blog;
