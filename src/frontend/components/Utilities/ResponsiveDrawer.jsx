import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assets/attiro.png";
import useClosetHistory  from "./useClosetHistory";

const drawerWidth = 200;
function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const { history } = useClosetHistory();

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div className="text-white">
      <Toolbar />
      <Divider />
      <List>
        {/* {["History 1", "History 2", "History 3", "History 4"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))} */}
        {history.length === 0 ? (
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="History" />
            </ListItemButton>
          </ListItem>
        ) : (
          history.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton onClick={() => console.log("select history", item)}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: 1,
                    overflow: "hidden",
                    mr: 1,
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #333",
                  }}
                >
                  {item.imageSrc ? (
                    <img src={item.imageSrc} alt={item.label || "History item"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : null}
                </Box>
                <ListItemText
                  primary={item.label || "Unnamed upload"}
                  secondary={new Date(item.createdAt).toLocaleString()}
                  primaryTypographyProps={{ noWrap: true }}
                  secondaryTypographyProps={{ noWrap: true }}
                />
                {item.dominantColor ? (
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: item.dominantColor,
                      border: "1px solid #444",
                      ml: 1,
                    }}
                  />
                ) : null}
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "black",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: "white",
                display: "flex",
                mr: 2,
                borderRadius: "50%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={logo} alt="Attiro logo" style={{ padding: "6px" }} />
            </Box>
          </Typography>
          <Typography sx={{ fontWeight: 800, fontFamily: "-apple-system" }}>ATTIRO</Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },

            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, backgroundColor: "#181818" },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, backgroundColor: "#181818" },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
