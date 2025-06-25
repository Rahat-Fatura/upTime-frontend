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
import { Password, TimerOutlined, Update, Verified } from "@mui/icons-material";
import { Handshake, ManageAccounts, ManageAccountsRounded, RollerShades, WorkOutlineRounded } from "@mui/icons-material";
import { AddressBook, HandThreeFingers, Trees } from "tabler-icons-react";

const UserProfileInfoPage = ({ userInfo}) => {
  return (
    <Grid item md={12} className="grid-area">
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={5}>
              <Typography variant="h6" sx={{ ml: "2vh" }}>
                Bilgiler
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <FlagIcon />
                  </ListItemIcon>
                  <ListItemText primary="id" secondary={userInfo.id} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Adı" secondary={userInfo.name} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={userInfo.email}
                
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Password/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Şifre"
                    secondary={"************"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Yetkisi" secondary={userInfo.role} />
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
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <TimerOutlined/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Oluşturma Tarihi"
                    secondary={String(userInfo.created_at).split('T')[0]}
                    
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Update/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Güncelleme Tarihi"
                    secondary={String(userInfo.updated_at).split('T')[0]?String(userInfo.updated_at).split('T')[0] : ""}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Verified/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Email doğurulaması"
                    secondary={userInfo.isEmailVerified?'Onaylı':'Onaylı Değil'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Telefon No"
                    secondary={userInfo.number? userInfo.number : "Belirtilmemiş"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AddressBook />
                  </ListItemIcon>
                  <ListItemText
                    primary="Adres"
                    secondary={userInfo.adres? userInfo.adres : "Belirtilmemiş"}
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
