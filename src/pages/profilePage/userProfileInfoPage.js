import { useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";

import WorkIcon from "@mui/icons-material/Work";
import FlagIcon from "@mui/icons-material/Flag";
import LanguageIcon from "@mui/icons-material/Language";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { Handshake, ManageAccounts, ManageAccountsRounded, RollerShades, WorkOutlineRounded } from "@mui/icons-material";
import { HandThreeFingers, Trees } from "tabler-icons-react";

const UserProfileInfoPage = ({ userInfo}) => {
  return (
    <Grid item md={12} className="grid-area">
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={5}>
              <Typography variant="h6" sx={{ ml: "2vh" }}>
                User info
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Name" secondary={userInfo.name} />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <RollerShades />
                  </ListItemIcon>
                  <ListItemText primary="Role" secondary={userInfo.role} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Top Management" secondary={userInfo.country} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Handshake/>
                  </ListItemIcon>
                  <ListItemText primary="Sub Administration" secondary={userInfo.language} />
                </ListItem>
              </List>
            </Grid>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", md: "block" } }}
            />
            <Grid item md={1}></Grid>
            <Grid item md={5}>
              <Typography variant="h6" sx={{ ml: "2vh" }}>
                İletişim
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={userInfo.email}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default UserProfileInfoPage;
