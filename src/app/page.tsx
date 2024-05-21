"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Card,
  Divider,
  Typography,
  Box,
  Chip,
  Button,
  Modal,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CircleIcon from "@mui/icons-material/Circle";
import GroupIcon from "@mui/icons-material/Group";
import NextEventIcon from "@mui/icons-material/Upcoming";
import BackHandIcon from "@mui/icons-material/BackHand";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LinkIcon from "@mui/icons-material/Link";
import DescriptionIcon from "@mui/icons-material/Description";
import "./globals.css";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [eventCounts, setEventCounts] = useState({
    total: 0,
    Activities: 0,
    Cultural: 0,
    Projects: 0,
    HR: 0,
    Comm: 0,
  });
  const [nextEvent, setNextEvent] = useState(null);
  const [daysUntilNextEvent, setDaysUntilNextEvent] = useState(null);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const router = useRouter();

  const links = [
    { href: "https://eventupp.eu", text: "ESN Portal" },
    { href: "https://egm-app.click/", text: "EGM App" },
    { href: "https://ga.esn.org/", text: "GA App" },
    //{
    //  href: "https://drive.google.com/file/d/140n11LyEW5tzFJog4h0ESVc4znt20pen/view?usp=sharing",
    //  text: "Standing Orders",
    //},
    //{
    //  href: "https://drive.google.com/file/d/1uZW-axlbzCrgRcfXhFCnlyqlG6ORHcjc/view?usp=sharing",
    //  text: "Statutes",
    //},
  ];

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

  useEffect(() => {
    fetchEvents();
  }, []);

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
      calculateEventCounts(data);
      findNextEvent(data);
      findAvailableEvents(data);
    } catch (error) {
      console.log("Error loading events", error);
    }
  };

  const calculateEventCounts = (events) => {
    const counts = {
      total: events.length,
      Activities: events.filter((event) => event.department === "Activities")
        .length,
      Cultural: events.filter((event) => event.department === "Cultural")
        .length,
      Projects: events.filter((event) => event.department === "Projects")
        .length,
      HR: events.filter((event) => event.department === "HR").length,
      Comm: events.filter((event) => event.department === "Comm").length,
    };
    setEventCounts(counts);
  };

  const findNextEvent = (events) => {
    const upcomingEvents = events.filter(
      (event) => new Date(event.date) >= new Date()
    );
    if (upcomingEvents.length > 0) {
      const next = upcomingEvents.reduce((earliest, current) =>
        new Date(current.date) < new Date(earliest.date) ? current : earliest
      );
      setNextEvent(next);
      calculateDaysUntilNextEvent(next.date);
    }
  };

  const calculateDaysUntilNextEvent = (eventDate) => {
    const currentDate = new Date();
    const targetDate = new Date(eventDate);
    const timeDifference = targetDate - currentDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    setDaysUntilNextEvent(daysDifference);
  };

  const findAvailableEvents = (events) => {
    const available = events.filter((event) => event.status === "Available");
    setAvailableEvents(available);
  };

  const handleHelpClick = () => {
    router.push("/Events");
  };

  const handleOpen = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const ListItemLink = ({ href, text }) => {
    const handleClick = (event) => {
      event.preventDefault();
      // Perform the desired action here
      // For example, navigate to the specified href
      window.open(href, "_blank");
    };

    return (
      <ListItemButton href={href} onClick={handleClick}>
        <ListItemIcon>
          <LinkIcon />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6} xl={6}>
          <Card
            sx={{
              textAlign: "center",
              py: 4,
              px: 2,
              elevation: 3,
              bgcolor: "#f5f5f5",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // Center the card content
            }}
          >
            <Grid container alignItems="center">
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center" mb={2}>
                  <EventAvailableIcon fontSize="large" color="primary" />
                </Box>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  Total Events
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {eventCounts.total}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  mt={2}
                  ml={14}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <CircleIcon
                      fontSize="small"
                      sx={{ color: getDepartmentColor("Activities") }}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {eventCounts.Activities} Activities
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CircleIcon
                      fontSize="small"
                      sx={{ color: getDepartmentColor("Cultural") }}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {eventCounts.Cultural} Cultural
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CircleIcon
                      fontSize="small"
                      sx={{ color: getDepartmentColor("Projects") }}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {eventCounts.Projects} Projects
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CircleIcon
                      fontSize="small"
                      sx={{ color: getDepartmentColor("HR") }}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {eventCounts.HR} HR
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <CircleIcon
                      fontSize="small"
                      sx={{ color: getDepartmentColor("Comm") }}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {eventCounts.Comm} Comm
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} xl={6}>
          <Card
            sx={{
              textAlign: "center",
              py: 4,
              px: 2,
              elevation: 3,
              bgcolor: "#f5f5f5",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // Center the card content
            }}
          >
            <Grid container alignItems="center">
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center" mb={2}>
                  <GroupIcon fontSize="large" color="primary" />
                </Box>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  General Meetings
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {/* Display a random number of GMs */}
                  15
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  mt={2}
                  ml={8}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body" sx={{ ml: 1 }}>
                      {/* Display a dummy percentage */}
                      Attendance 69%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        {nextEvent && (
          <Grid item xs={12} md={6} xl={6}>
            <Card
              sx={{
                py: 4,
                px: 2,
                elevation: 3,
                bgcolor: "#f5f5f5",
                borderRadius: "16px",
              }}
            >
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                  >
                    <NextEventIcon
                      fontSize="large"
                      color="primary"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      Next Event
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {nextEvent.name}
                    </Typography>
                    {daysUntilNextEvent !== null && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, fontStyle: "italic" }}
                      >
                        {daysUntilNextEvent} days until the event
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} mt={2}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                  >
                    <Chip
                      label={nextEvent.department}
                      sx={{
                        backgroundColor: getDepartmentColor(
                          nextEvent.department
                        ),
                        color: "white",
                        fontWeight: "bold",
                        mb: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <CalendarTodayIcon sx={{ mr: 1 }} />
                      {new Date(nextEvent.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <LocationOnIcon sx={{ mr: 1 }} />
                      {nextEvent.location}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}
        {availableEvents.length === 0 ? (
          <Grid item xs={12} md={6} xl={6}>
            <Card
              sx={{
                py: 4,
                px: 2,
                elevation: 3,
                bgcolor: "#f5f5f5",
                borderRadius: "16px",
              }}
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
              >
                <BackHandIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 1 }}>
                  All spots have been filled!
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "secondary" }}>
                  Thank you for your help
                </Typography>
              </Box>
            </Card>
          </Grid>
        ) : (
          <Grid item xs={12} md={6} xl={6}>
            <Card
              sx={{
                py: 4,
                px: 2,
                elevation: 3,
                bgcolor: "#f5f5f5",
                borderRadius: "16px",
              }}
            >
              <Grid container alignItems="center" sx={{ height: "100%" }}>
                <Grid item xs={12} md={6}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                  >
                    <BackHandIcon
                      fontSize="large"
                      color="primary"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      OC Spots
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {availableEvents.length}
                    </Typography>
                    <Box display="flex" justifyContent="center" mt={2}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleHelpClick}
                      >
                        I will help
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box sx={{ mt: 2 }}>
                    {availableEvents
                      .slice()
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .slice(0, 3)
                      .map((event, index) => (
                        <Button
                          key={index}
                          variant="text"
                          onClick={() => handleOpen(event)}
                          sx={{
                            display: "block",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          {event.name}
                        </Button>
                      ))}
                    {availableEvents.length > 3 && (
                      <Button
                        variant="text"
                        onClick={() => router.push("/Events")}
                        sx={{
                          display: "block",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <MoreHorizIcon sx={{ mr: 1 }} />
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}
        <Grid item xs={12} md={6} xl={6}>
          <Card
            sx={{
              py: 4,
              px: 2,
              elevation: 3,
              bgcolor: "#f5f5f5",
              borderRadius: "16px",
            }}
          >
            <Grid container>
              <Grid item xs={12} md={6}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mt: 2 }}
                >
                  <DescriptionIcon fontSize="large" color="primary" />
                </Box>
                <Typography variant="h5" style={{ textAlign: "center" }}>
                  Important Documents
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <List>
                  {links.map((link) => (
                    <ListItemLink key={link.href} {...link} />
                  ))}
                </List>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose}>
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
            borderRadius: "16px",
          }}
        >
          {selectedEvent && (
            <>
              <Typography variant="h6" component="h2">
                {selectedEvent.name}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Description: {selectedEvent.description}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <CalendarTodayIcon sx={{ mr: 1 }} />
                {new Date(selectedEvent.date).toLocaleDateString()}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <LocationOnIcon sx={{ mr: 1 }} />
                {selectedEvent.location}
              </Typography>
              <Chip
                label={selectedEvent.department}
                sx={{
                  backgroundColor: getDepartmentColor(selectedEvent.department),
                  color: "white",
                  fontWeight: "bold",
                  mt: 2,
                }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                OC Members
              </Typography>
              <List>
                {selectedEvent.oc.map((member, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={member.name} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default Home;
