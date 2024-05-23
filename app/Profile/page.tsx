"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  CardActions,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";

const Member = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/");
    },
  });

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" align="center">Profile/Client Session</Typography>
            <List>
              <ListItem>
                <ListItemText>
                  <Box sx={{ color: "text.secondary" }}>Name</Box>
                  <Box sx={{ color: "text.primary", fontSize: 16 }}>
                    {session?.user?.name}
                  </Box>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Box sx={{ color: "text.secondary" }}>Email</Box>
                  <Box sx={{ color: "text.primary", fontSize: 16 }}>
                    {session?.user?.email}
                  </Box>
                </ListItemText>
              </ListItem>
              {/* <ListItem>
                <ListItemText>
                  <Box sx={{ color: "text.secondary" }}>Role</Box>
                  <Box sx={{ color: "text.primary", fontSize: 16 }}>
                    {session?.user?.role}
                  </Box>
                </ListItemText>
              </ListItem> */}
            </List>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href={"/api/auth/signout?callbackUrl=/"}
              onClick={() => redirect("/api/auth/signout?callbackUrl=/")}
            >
              Sign Out
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
};

export default Member;
