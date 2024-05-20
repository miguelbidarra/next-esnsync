"use client";

// Import statements
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  TableSortLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EuroIcon from "@mui/icons-material/Euro";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BackHandIcon from "@mui/icons-material/BackHand";

const Events = () => {
  const session = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openOcModal, setOpenOcModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedOc, setSelectedOc] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    department: "",
    location: "",
    status: "",
  });
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents()]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events", {
        cache: "no-cache",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);
      console.log("Events loaded", data);
    } catch (error) {
      console.log("Error loading Events", error);
    }
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setFormData(event);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedEvent(null);
    setFormData({
      name: "",
      description: "",
      date: "",
      department: "",
      location: "",
      status: "",
    });
  };

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setSelectedOc(event.oc);
    setOpenOcModal(true);
  };

  const handleCloseOcModal = () => {
    setSelectedEvent(null);
    setOpenOcModal(false);
    setSelectedOc([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDeleteClick = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this event?"
      );
      if (!confirmDelete) {
        return;
      }

      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      // Remove the deleted event from the state
      setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.log("Error deleting event", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const response = await fetch(`/api/events/${selectedEvent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const updatedEvent = await response.json();

      // Update the event in the local state
      setEvents(
        events.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
      handleCloseEditModal();
    } catch (error) {
      console.log("Error updating event", error);
    }
  };

  const handleApplyClick = async (eventId) => {
    if (!session || !session.data || !session.data.user) {
      console.log("User not logged in");
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}/oc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: session.data.user.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to apply to event");
      }

      const result = await response.json();
      console.log(result.message);

      // Optionally update the local state to reflect the applied user
      fetchEvents();
    } catch (error) {
      console.log("Error applying to event", error);
    }
  };

  const handleDeleteOcClick = async (userId) => {
    if (!session || !session.data || !session.data.user) {
      console.log("User not logged in");
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}/oc`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: session.data.user.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete user from OC");
      }

      const result = await response.json();
      console.log(result.message);

      // Optionally update the local state to reflect the deleted user
      fetchEvents();
    } catch (error) {
      console.log("Error deleting user from OC", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "#22a054";
      case "Full":
        return "#eb445a";
      default:
        return "grey";
    }
  };

  const getDepartmentColor = (department) => {
    switch (department) {
      case "Activities":
        return "#ec008c";
      case "Cultural":
        return "#7ac143";
      case "Projects":
        return "#00aeef";
      case "HR":
        return "#2e3192";
      case "Comm":
        return "#f47b20";
      default:
        return "grey";
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (orderBy === "name") {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (orderBy === "department") {
      return order === "asc"
        ? a.department.localeCompare(b.department)
        : b.department.localeCompare(a.department);
    }
    if (orderBy === "date") {
      return order === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    if (orderBy === "status") {
      return order === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  return (
    <>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Events</h1>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#0d47a1" }}>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}></TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleRequestSort("name")}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              <TableSortLabel
                active={orderBy === "date"}
                direction={orderBy === "date" ? order : "asc"}
                onClick={() => handleRequestSort("date")}
              >
                Date
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              <TableSortLabel
                active={orderBy === "department"}
                direction={orderBy === "department" ? order : "asc"}
                onClick={() => handleRequestSort("department")}
              >
                Department
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Location
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Description
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              <TableSortLabel
                active={orderBy === "status"}
                direction={orderBy === "status" ? order : "asc"}
                onClick={() => handleRequestSort("status")}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedEvents.map((event) => (
            <TableRow
              key={event._id}
              onClick={() => handleRowClick(event)}
              sx={{
                "&:nth-of-type(odd)": { backgroundColor: "#ffffff" },
              }}
            >
              <TableCell>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyClick(event._id);
                  }}
                  sx={{ borderRadius: "20px", textTransform: "none" }}
                  disabled={event.status === "Full"}
                >
                  <BackHandIcon />
                </IconButton>
              </TableCell>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>
                <Chip
                  label={event.department}
                  sx={{
                    backgroundColor: getDepartmentColor(event.department),
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell>
                <Chip
                  label={event.status}
                  sx={{
                    backgroundColor: getStatusColor(event.status),
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(event);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(event._id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton size="small" color="success">
                  <EuroIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <h2>Edit Event</h2>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline // Add this prop to make the text field expand vertically
              rows={3} // Set the number of rows to determine the initial height
            />

            <Select
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Department
              </MenuItem>
              <MenuItem value="Activities">Activities</MenuItem>
              <MenuItem value="Cultural">Cultural</MenuItem>
              <MenuItem value="Projects">Projects</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Comm">Comm</MenuItem>
            </Select>
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Status
              </MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Full">Full</MenuItem>
            </Select>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Save
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={openOcModal} onClose={handleCloseOcModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <h2>Organizing Committe</h2>
          <List>
            {selectedOc.map((item, index) => (
              <ListItem
                key={index}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <ListItemText primary={item.name} />
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteOcClick(item.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Button
            onClick={handleCloseOcModal}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Events;
