import React from "react";
import { Button, TextField, Grid, Divider } from "@mui/material";

const UserProfileSettingsPage = ({ userInfo}) => {

  return (
    <Grid
      container
      item
      md={12}
      className="grid-area"
      justifyContent={"space-between"}
    >
      <Grid
        item
        xs={12}
        md={5.5}
        sx={{ display: "flex", gap: 2, flexDirection: "column" }}
      >
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            className="input-field"
            label="Ad"
            variant="outlined"
            defaultValue={userInfo.name}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            className="input-field"
            label="Email"
            variant="outlined"
            defaultValue={userInfo.email}
          />
        </Grid>
      </Grid>
      <Divider
        orientation="vertical"
        flexItem
        sx={{ display: { xs: "none", md: "block" } }}
      />
      

      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          mt: "3vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid md={3}>
          <Button variant="contained" color="primary" className="custom-button">
            Değişiklikleri Kaydet
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserProfileSettingsPage;
