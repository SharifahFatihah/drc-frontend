import { createTheme, TextField, ThemeProvider } from "@material-ui/core";
import React, { useState } from "react";
import { CryptoState } from "../CryptoContext";

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

  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={coin?.image?.small} height={20} />
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
      <div>
        {symbol}
        {currency}
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
    </ThemeProvider>
  );
}

export default CoinConverter;
