import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "../asset/menu.png";
import { createTheme, ThemeProvider } from "@material-ui/core";
import UserSidebar from "./UserSidebar";
import AuthModal from "./Authentication/AuthModal";
import { CryptoState } from "../CryptoContext";
import { useNavigate } from "react-router-dom";

export default function HeaderMenu({ selectMenu, isMobile }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const { user } = CryptoState();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const darkTheme = createTheme({
    palette: {
      primary: { main: "#fff" },
      type: "light",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <img src={MenuIcon} alt="menu icon" height={40} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Portfoilio</MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/");
            handleClose();
          }}
        >
          Coin
        </MenuItem>

        <MenuItem onClick={handleClose}>News</MenuItem>
        <MenuItem onClick={handleClose}>{selectMenu}</MenuItem>
      </Menu>
    </ThemeProvider>
  );
}
