"use client"

import React from "react";
import { TextField, Button, Typography, Box, Container, Stack } from "@mui/material";

const Refunds = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const response = await fetch('localhost:4200/api/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      // Handle error
      console.error('Failed to submit form');
    }
  };

  return (
    <Container>
      <Typography variant="h2" align="center">Refunds</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Stack spacing={2} sx={{ marginBottom: 2 }}>
          <TextField label="First and Last Name" name="name" required />
          <TextField label="I'm a..." name="role" required />
          <TextField label="Event Name" name="eventName" required />
          <TextField label="Invoice Date" name="date" type="date" required />
          <TextField label="Brief Description" name="description" required />
          <TextField label="Value" name="value" type="number" required />
          <TextField label="Image Upload" name="image" type="file" required />
          <TextField label="IBAN" name="iban" />
        </Stack>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default Refunds;