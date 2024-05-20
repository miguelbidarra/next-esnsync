"use client";

import React, { useState } from "react";
import {
  Typography,
  Paper,
  Card,
  Box,
  CardContent,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from '@mui/icons-material/Edit';

const Budgets = () => {
  const [budgets, setBudgets] = useState([
    { id: 1, name: "Event 1", totalBudget: 1000, status: "For approval" },
    { id: 2, name: "Event 2", totalBudget: 2000, status: "Approved" },
    { id: 3, name: "Event 3", totalBudget: 2000, status: "For approval" },
    { id: 4, name: "Event 4", totalBudget: 3000, status: "Approved" },
    { id: 5, name: "Event 5", totalBudget: 4000, status: "For approval" },
    { id: 6, name: "Event 6", totalBudget: 5000, status: "Approved" },
  ]);

  const moveCardToApproved = (id) => {
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.id === id ? { ...budget, status: "Approved" } : budget
      )
    );
  };

const editBudget = (id) => {
    setBudgets((prevBudgets) =>
        prevBudgets.map((budget) =>
            budget.id === id ? { ...budget, status: "For approval" } : budget
        )
    );
};

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h4">For Approval</Typography>
        <Stack spacing={2}>
          {budgets
            .filter((budget) => budget.status === "For approval")
            .map((budget) => (
              <Card key={budget.id}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Box flexGrow={1}>
                      <Typography variant="h5">{budget.name}</Typography>
                      <Typography variant="body1">
                        Total Budget: {budget.totalBudget}
                      </Typography>
                    </Box>
                    <IconButton
                      color="success"
                      onClick={() => moveCardToApproved(budget.id)}
                    >
                      <CheckIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
        </Stack>
      </Grid>
      <Grid item xs={6}>
  <Typography variant="h4">Approved</Typography>
  <Stack spacing={2}>
    {budgets
      .filter((budget) => budget.status === "Approved")
      .map((budget) => (
        <Card key={budget.id}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Box flexGrow={1}>
                <Typography variant="h5">{budget.name}</Typography>
                <Typography variant="body1">
                  Total Budget: {budget.totalBudget}
                </Typography>
              </Box>
              <IconButton
                color="primary"
                onClick={() => editBudget(budget.id)}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
  </Stack>
</Grid>
      <Grid item xs={12}>
        <Typography variant="h4">All Budgets</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Total Budget</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell component="th" scope="row">
                    {budget.name}
                  </TableCell>
                  <TableCell align="right">{budget.totalBudget}</TableCell>
                  <TableCell align="right">{budget.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Budgets;
