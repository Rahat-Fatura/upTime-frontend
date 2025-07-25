import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Grid,
  Checkbox,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { logout } from "../../api/auth/logout";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import localStorage from "local-storage";
import {
  Engineering,
  ExpandLess,
  ExpandMore,
  Person,
} from "@mui/icons-material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import largeLogo from "../../assets/images/by-rahatsistem-logo.png";
import smallLogo from "../../assets/images/rahatsistem-logo.png";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { ReportAnalytics, Server } from "tabler-icons-react";


const menuItems = [
  { text: "Monitors", icon: <Server size={22}/> , path: "/user/monitors" },
  //{ text: "Raporlar", icon: <ReportAnalytics size={22} />, path: "/user/monitoringReports" },
 // { text: "Anlık Kontrol", icon: <CellTowerIcon size={22} />, path: "/user/instantControl" },
  // { text: "Bakım", icon: <Engineering size={22} />, path: "/user/maintanance" },
 /* { text: "Team Members", icon: <TopologyBus size={22} />, path: "/user/teamMembers" },
  { text: "Integrations & API", icon: <IntegrationInstructionsOutlined size={22} />, path: "/user/integrationsApi" },*/

  { text: "Profil", icon: <Person size={22} />, path: "/user/profile" },
  {
    text: "Çıkış",
    icon: <LogoutOutlinedIcon size={22} />,
    action: logout,
    path: "/login",
  },
];

const Sidebar = ({ status, toggleSidebar }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Sub-menu'yü aktif yola göre otomatik aç
  useEffect(() => {
    const initialOpenSubMenu = {};
    menuItems.forEach((item) => {
      if (item.subItems) {
        const isSubItemActive = item.subItems.some(
          (subItem) => subItem.path && location.pathname === subItem.path
        );
        if (isSubItemActive) {
          initialOpenSubMenu[item.text] = true;
        }
      }
    });
    setOpenSubMenu(initialOpenSubMenu);
  }, [location.pathname]);

  const toggleDrawer = () => {
    toggleSidebar(!status);
  };

  const handleMouseEnter = () => {
    if (!status) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleSubMenuToggle = (text) => {
    setOpenSubMenu((prevState) => ({ ...prevState, [text]: !prevState[text] }));
  };

  const drawerWidth = status ? 240 : 60;
  const effectiveWidth = status || isHovered ? 240 : 60;

  const handleItemClick = (item) => {
    if (item.action) {
      item.action();
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  const renderMenuItem = (item, index) => {
    const isActive = location.pathname === item.path;

    if (item.header) {
      return (
        <Typography
          key={index}
          variant="subtitle2"
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            height: "0.85rem",
            maxWidth: "100%",
            pl: 2,
            pt: 1,
            pb: 1,
            mx: 2,
            color: "#666",
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: "0.85rem",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          {status || isHovered ? item.text : ""}
        </Typography>
      );
    }

    const listItemStyles = {
      mt: 0.3,
      mb: 0.3,
      borderRadius: "8px",
      position: "relative",
      overflow: "hidden",
      height: "2.8rem",
      width: "99%",
      backgroundColor: isActive ? theme.palette.primary.main : "background.paper",
      color: isActive ? "white" : "#333",
      "&:hover": {
        backgroundColor: isActive ? theme.palette.primary.main  : "background.paper",
        color: isActive ? "white" : theme.palette.primary.main ,
        "&::before": {
          transform: isActive ? "scaleX(0)" : "scaleX(1)",
          transformOrigin: "0 50%",
        },
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "99%",
        height: "100%",
        borderRadius: "8px",
        backgroundColor: "#1976d281",
        transform: "scaleX(0)",
        transformOrigin: "0 50%",
        transition: "transform 0.475s",
        zIndex: 0,
      },
      "& .MuiListItemText-primary": {
        color: isActive ? "white" : "#333",
      },
      "& .MuiListItemIcon-root": {
        color: isActive ? "white" : "#333",
        minWidth: 40,
      },
      "& > *": {
        position: "relative",
        zIndex: 1,
      },
    };

    if (item.subItems) {
      const subItemActive = item.subItems.some(
        (subItem) => subItem.path && location.pathname === subItem.path
      );

      return (
        <React.Fragment key={item.text}>
          <ListItem
            button
            onClick={() => handleSubMenuToggle(item.text)}
            sx={{
              ...listItemStyles,
              backgroundColor: subItemActive ? theme.palette.primary.main  : "background.paper",
              color: subItemActive ? "white" : "#333",
              "& .MuiListItemText-primary": {
                color: subItemActive ? "white" : "#333",
              },
              "& .MuiListItemIcon-root": {
                color: subItemActive ? "white" : "#333",
                minWidth: 40,
              },
              "&:hover": {
                backgroundColor: subItemActive ? theme.palette.primary.main : "background.paper",
                color: subItemActive ? "white" : theme.palette.primary.main ,
                "&::before": {
                  transform: subItemActive ? "scaleX(0)" : "scaleX(1)",
                  transformOrigin: "0 50%",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{ color: subItemActive ? "white" : "#333", minWidth: 40 }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            />
            {openSubMenu[item.text] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSubMenu[item.text]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems.map((subItem, subIndex) => {
                const isSubItemActive =
                  subItem.path && location.pathname === subItem.path;
                return (
                  <ListItem
                    button
                    key={subItem.text}
                    component={subItem.path ? Link : "div"}
                    to={subItem.path}
                    sx={{
                      ...listItemStyles,
                      width: "95%",
                      backgroundColor: isSubItemActive
                        ? theme.palette.primary.main
                        : "background.paper",
                      color: isSubItemActive ? "white" : "#333",
                      pl: 2,
                      m: 1,
                      "&:hover": {
                        backgroundColor: isSubItemActive
                          ? theme.palette.primary.main
                          : "background.paper",
                        color: isSubItemActive ? "white" : theme.palette.primary.main ,
                        "&::before": {
                          transform: isSubItemActive
                            ? "scaleX(0)"
                            : "scaleX(1)",
                          transformOrigin: "0 50%",
                        },
                      },
                      "& .MuiListItemText-primary": {
                        color: isSubItemActive ? "white" : "#333",
                      },
                      "& .MuiListItemIcon-root": {
                        color: isSubItemActive ? "white" : "#333",
                        minWidth: 40,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isSubItemActive ? "white" : "#333",
                        minWidth: 40,
                      }}
                    >
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={subItem.text}
                      sx={{
                        width: "auto",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        maxWidth: "99%",
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    // Ana menü öğeleri için mevcut kod (değişmedi)
    return (
      <ListItem
        button
        key={item.text}
        onClick={item.action ? () => handleItemClick(item) : undefined}
        component={item.action ? undefined : Link}
        to={item.action ? undefined : item.path}
        sx={{
          ...listItemStyles,
          "&:hover": {
            backgroundColor: isActive ? theme.palette.primary.main : "background.paper",
            color: isActive ? "white" : theme.palette.primary.main,
            "&::before": {
              transform: isActive ? "scaleX(0)" : "scaleX(1)",
              transformOrigin: "0 50%",
            },
          },
        }}
      >
        <ListItemIcon sx={{ color: isActive ? "white" : "#333", minWidth: 40 }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            maxWidth: "99%",
          }}
        />
        {item.badge && (
          <Grid
            sx={{
              color: isActive ? "white" : theme.palette.primary.main,
              border: "1px solid",
              borderColor: isActive ? "white" : theme.palette.primary.main,
              borderRadius: "50%",
              width: 20,
              height: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            {item.badge}
          </Grid>
        )}
      </ListItem>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: effectiveWidth,
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
          transition: "width 0.3s ease",
          overflowX: "hidden",
          overflowY: isHovered === true || status === true ? "" : "hidden",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
        },
        "& .MuiDrawer-paper::-webkit-scrollbar": {
          width: "2px", // Scrollbar genişliği
        },
        "& .MuiDrawer-paper::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: 10,
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Grid
        sx={{
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100px", // Genişliği logolardan biri kadar sabit tut
            height: "40px",
          }}
        >
          {/* Large Logo */}
          <Box
            component="img"
            src={largeLogo}
            alt="Large Logo"
            sx={{
              position: "absolute",
              height: "40px",
              transition: "opacity 0.4s ease",
              opacity: status || isHovered ? 1 : 0,
            }}
          />
          {/* Small Logo */}
          {!isMobile && (
            <Box
              component="img"
              src={smallLogo}
              alt="Small Logo"
              sx={{
                height: "40px",
                transition: "opacity 0.4s ease",
                opacity:
                  !isMobile || (isMobile && (status || isHovered)) ? 1 : 0,
              }}
            />
          )}
        </Box>
        <Checkbox
          icon={
            <RadioButtonUncheckedIcon sx={{ color: "#2a2c2a", fontSize: 24 }} />
          }
          checkedIcon={
            <RadioButtonCheckedIcon sx={{ color: "#2a2c2a", fontSize: 24 }} />
          }
          checked={status}
          onChange={toggleDrawer}
          onClick={() => {
            localStorage.set("sidebar", `${!status}`);
          }}
          sx={{
            mx: { xs: 1, sm: 1, md: status || isHovered ? 0 : 2 },

            p: 0,
          }}
        />
      </Grid>
      <List
        sx={{
          flex: 1,
          m: "0px 5px 0px 4px",
          ...(isMobile && { mt: 0 }),
          overflowY: isHovered || status ? "auto" : "hidden",
          "&::-webkit-scrollbar": {
            width: "4px", // Scrollbar genişliği
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: 10,
          },
        }}
      >
        {menuItems.map(renderMenuItem)}
      </List>
    </Drawer>
  );
};

export default Sidebar;