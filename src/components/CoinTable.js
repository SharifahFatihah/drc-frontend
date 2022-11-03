import React, { useState, useEffect } from "react";
import Service from "../service/Service";
import { CryptoState } from "../CryptoContext";
import {
  makeStyles,
  createTheme,
  Container,
  Typography,
  ThemeProvider,
  TextField,
} from "@material-ui/core";
import MockTable from "../components/MockTable";

const useStyle = makeStyles((theme) => ({}));
function CoinTable() {
  const classes = useStyle();

  const { currency } = CryptoState();

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getCoinList = (currency) => {
    setLoading(true);

    Service.getCoinList(currency)
      .then((response) => {
        setCoins(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    getCoinList(currency);
  }, [currency]);

  const darkTheme = createTheme({
    palette: {
      primary: { main: "#fff" },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography variant="h4" style={{ margin: 20 }}>
          Crypto Coins
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 20 }}
        />

        <MockTable
          coins={Service.handleSearch(coins, search.toLocaleLowerCase())}
        />
      </Container>
    </ThemeProvider>
  );
}

export default CoinTable;
