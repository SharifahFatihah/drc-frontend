import React from "react";
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

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: "#fcc7f4",
    //fontFamily: "", //add later when font decided
    fontWeight: "bold",
    alignItems: "start",
  },
}));

function Header() {
  const classes = useStyles();
  const navigate = useNavigate();

  const { currency, setCurrency, user } = CryptoState();

  const darkTheme = createTheme({
    palette: {
      primary: { main: "#fff" },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar style={{ background: "#000000" }} position="sticky">
        <Container>
          <Toolbar>
            <Typography className={classes.title}>
              <img
                src={LogoIcon}
                height="30"
                onClick={() => navigate("/homepage")}
                style={{ cursor: "pointer" }}
              />
            </Typography>

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

            {user ? <UserSidebar /> : <AuthModal />}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
