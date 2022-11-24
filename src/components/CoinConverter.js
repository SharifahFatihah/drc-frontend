import {
  createTheme,
  TextField,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import { CryptoState } from "../CryptoContext";
import converter from "../asset/converter.png";

const useStyles = makeStyles((theme) => ({
  Converterbox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    padding: 20,
    width: "75%",
    margin: 15,
    borderRadius: "15px",
    background: "rgba(79, 58, 84, 0.52)",
    minHeight: "185px",
    [theme.breakpoints.down("md")]: {
      width: "20%",
      alignItems: "center",
    },
  },
}));

const darkTheme = createTheme({
  palette: {
    primary: { main: "#fff" },
    type: "dark",
  },
});

function CoinConverter({ coin }) {
  const [fiat, setFiat] = useState("");
  const [crypto, setCrypto] = useState("");

  const { symbol, currency } = CryptoState();
  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className={classes.Converterbox}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={coin?.image?.small}
              height={20}
              style={{ marginRight: 10 }}
            />
            {coin?.name}
          </div>
          <TextField
            variant="outlined"
            defaultValue=""
            label="insert crypto amount"
            value={crypto}
            onChange={(e) => {
              setCrypto(e.target.value);
              setFiat(
                e.target.value *
                  coin?.market_data?.current_price[currency?.toLowerCase()]
              );
            }}
            fullWidth
          />
        </div>

        <div>
          <img src={converter} height={50} />
        </div>
        <div className={classes.Converterbox}>
          <div>
          
            {currency}  ({symbol})
          </div>

          <TextField
            variant="outlined"
            defaultValue=""
            label="insert currency amount"
            value={fiat}
            onChange={(e) => {
              setFiat(e.target.value);
              setCrypto(
                e.target.value /
                  coin?.market_data?.current_price[currency?.toLowerCase()]
              );
            }}
            fullWidth
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default CoinConverter;
