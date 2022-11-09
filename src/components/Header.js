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

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: "#fcc7f4",
    //fontFamily: "", //add later when font decided
    fontWeight: "bold",
    cursor: "pointer",
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
      <AppBar color="transparent" position="sticky">
        <Container>
          <Toolbar>
            <Typography onClick={() => navigate("/")} className={classes.title}>
              KA-CHING!
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
