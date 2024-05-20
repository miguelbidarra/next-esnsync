"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import PersonIcon from "@mui/icons-material/Person";
import { AppBar, Toolbar } from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import FlagIcon from "@mui/icons-material/Flag";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import EuroIcon from "@mui/icons-material/Euro";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import logo from "./../assets/esnstar.png";

const Nav = () => {
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard"); // Initialize with default value

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleListItemClick = (itemText) => {
    setSelectedItem(itemText);
    toggleDrawer(false)();
  };

  const userDrawerList = [
    { text: "Dashboard", href: "/", icon: <DashboardIcon /> },
    { text: "Events", href: "/Events", icon: <FlagIcon /> },
    //{ text: "Server Member", href: "/ServerMember", icon: <FlagIcon /> },
    { text: "Profile", href: "/Profile", icon: <PersonIcon /> },
    { text: "Create Budget", href: "/CreateBudget", icon: <EuroIcon /> },
    { text: "Create Refund", href: "/CreateRefund", icon: <AddIcon /> },
    { text: "Logout", href: "/api/auth/signout", icon: <InboxIcon /> },
  ];

  const adminDrawerList = [
    { text: "Create User", href: "/CreateUser", icon: <PersonAddIcon /> },
    { text: "Create Event", href: "/CreateEvent", icon: <AddIcon /> },
    { text: "Users", href: "/Users", icon: <PersonIcon /> },
    { text: "Budgets", href: "/Budgets", icon: <EuroIcon /> },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {userDrawerList.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} href={item.href}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {session?.user?.role === "admin" && (
          <>
            <Divider />
            {adminDrawerList.map((item, index) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} href={item.href}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        )}
      </List>
      <Divider />
    </Box>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250 }} role="presentation">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                my: 2,
              }}
            >
              <Image src={logo} alt="ESNsync Logo" width={75} />
            </Box>

            <List>
              {userDrawerList.map((item, index) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    onClick={() => handleListItemClick(item.text)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}

              {session?.user?.role === "admin" && (
                <>
                  <ListItem>
                    <ListItemText primary="Admin actions" />
                  </ListItem>
                  {adminDrawerList.map((item, index) => (
                    <>
                      <ListItem key={item.text} disablePadding>
                        <ListItemButton
                          component={Link}
                          href={item.href}
                          onClick={() => handleListItemClick(item.text)}
                        >
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.text} />
                        </ListItemButton>
                      </ListItem>
                    </>
                  ))}
                </>
              )}
            </List>
            <Divider />
          </Box>
        </Drawer>
        <AppBar position="static" sx={{ bgcolor: "#222428" }} elevation={0}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component={Link}
              href={"/"}
              onClick={() => setSelectedItem("Dashboard")}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center", // Center vertically
                mr: 2,
              }}
            >
              <Image src={logo} alt="ESNsync Logo" width={30} />
            </Box>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {`ESNsync - ${selectedItem}`}{" "}
              {/* Use the selectedItem state here */}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Nav;
