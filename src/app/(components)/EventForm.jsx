"use client"
import { useState } from "react";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container } from "@mui/material";

const EventForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const event = { name, description, date, department, location };
    console.log("Creating event:", event);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const { data } = await response.json();
      console.log("Event created:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "400px",
          margin: "auto",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <TextField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl
          required
          style={{ marginBottom: "16px" }}
        >
          <InputLabel>Department</InputLabel>
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <MenuItem value="Activities">Activities</MenuItem>
            <MenuItem value="Cultural">Cultural</MenuItem>
            <MenuItem value="Projects">Projects</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Comm">Comm</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "16px" }}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default EventForm;
