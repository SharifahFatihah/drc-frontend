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
} from "@material-ui/core";

import { CryptoState } from "../CryptoContext";

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: "blue",
    //fontFamily: "", //add later when font decided
    fontWeight: "bold",
    cursor: "pointer",
    alignItems: "start",
  },
}));

function Header() {
  const classes = useStyles();
  const navigate = useNavigate();

  const { currency, setCurrency } = CryptoState();

  return (
    <AppBar color="transparent" position="static">
      <Container>
        <Toolbar>
          <Typography onClick={() => navigate("/")} className={classes.title}>
            Kaching
          </Typography>
          <Select //refer https://mui.com/material-ui/react-select/ for styling
            variant="outlined"
            style={{ width: 100, height: 40, marginLeft: 15 }}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <MenuItem value={"USD"}> USD </MenuItem>
            <MenuItem value={"MYR"}> MYR </MenuItem>
          </Select>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
