import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  makeStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core";

import { CryptoState } from "../CryptoContext";
import AuthModal from "./Authentication/AuthModal";
import UserSidebar from "./UserSidebar";
import LogoIcon from "../asset/logoicon.png";
import LogoWord from "../asset/logoword.png";
import HeaderMenu from "./HeaderMenu";

const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    color: "#fcc7f4",
    //fontFamily: "", //add later when font decided
    fontWeight: "bold",
    alignItems: "start",
  },
  navigations: {
    display: "flex",
    color: "white",
    fontFamily: "VT323",
    fontSize: "25px",
    width: "250px ",
    justifyContent: "space-around",
    cursor: "pointer",
  },
  navButton: {
    "&:hover": {
      color: "#FFE227",
    },
  },
}));

function Header() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  const { currency, setCurrency, user } = CryptoState();

  const darkTheme = createTheme({
    palette: {
      primary: { main: "#fff" },
      type: "dark",
    },
  });

  const handleResize = () => {
    if (window.innerWidth < 800) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  const selectMenu = (
    <Select
      variant="outlined"
      style={{ width: 100, height: 40, margin: 15 }}
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
    >
      <MenuItem value={"USD"}> USD </MenuItem>
      <MenuItem value={"MYR"}> MYR </MenuItem>
      <MenuItem value={"EUR"}> EUR </MenuItem>
      <MenuItem value={"JPY"}> JPY </MenuItem>
      <MenuItem value={"GBP"}> GBP </MenuItem>
      <MenuItem value={"AUD"}> AUD </MenuItem>
      <MenuItem value={"CAD"}> CAD </MenuItem>
    </Select>
  );

  const navigations = (
    <div className={classes.navigations}>
      <div
        className={classes.navButton}
        onClick={() => {
          navigate("/");
        }}
      >
        Portfolio
      </div>
      <div
        className={classes.navButton}
        onClick={() => {
          navigate("/coinList");
        }}
      >
        Coins
      </div>
      <div
        className={classes.navButton}
        onClick={() => {
          navigate("/");
        }}
      >
        News
      </div>
    </div>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar style={{ background: "#1b0a24" }} position="sticky">
        <Container>
          <Toolbar>
            <Typography className={classes.title}>
              <img
                src={LogoIcon}
                height="30"
                onClick={() => navigate("/homepage")}
                style={{ cursor: "pointer" }}
              />
              {!isMobile && (
                <img
                  src={LogoWord}
                  height="30"
                  onClick={() => navigate("/homepage")}
                  style={{ cursor: "pointer" }}
                />
              )}
            </Typography>

            {!isMobile && navigations}

            {!isMobile && selectMenu}
            {user ? <UserSidebar /> : <AuthModal />}
            {isMobile && (
              <HeaderMenu selectMenu={selectMenu} isMobile={isMobile} />
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
