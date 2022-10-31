import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import Service from "../service/Service";
import { makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import parser from "html-react-parser";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    whiteSpace: "wrap",
  },
  description: {
    padding: 25,
    textAlign: "justify",
  },
  coinBasicContainer: {
    display: "flex",
    flexDirection: "column",
  },
  coinBasic: {
    display: "flex",
    alignItems: "center",
  },
}));

function CoinPage() {
  const classes = useStyles();
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const [loading, setLoading] = useState(false);

  const { currency, symbol } = CryptoState();

  const getSingleCoin = (e) => {
    setLoading(true);

    Service.getSingleCoin(e)
      .then((response) => {
        setCoin(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(
    () => {
      setLoading(true);
      getSingleCoin(id);
    },
    [id],
    [currency]
  );

  console.log(coin);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img src={coin?.image.large} alt={coin?.name} height="200" />
        <Typography variant="h2">{coin?.name}</Typography>
        {/* <Typography variant="subtitle1" className={classes.description}>
          {parser(`${coin?.description.en.split(". ")[0]}`)}
        </Typography> */}
        <div className={classes.coinBasicContainer}>
          <span className={classes.coinBasic}>
            <Typography variant="h5" className={classes.description}>
              Rank: {coin?.market_cap_rank}
            </Typography>
          </span>
          <span className={classes.coinBasic}>
            <Typography variant="h5" className={classes.description}>
              Current Price: {symbol}
              {coin?.market_data.current_price[currency.toLowerCase()]}
            </Typography>
          </span>
          <span className={classes.coinBasic}>
            <Typography variant="h5" className={classes.description}>
              Market Cap: {symbol}
              {coin?.market_data.market_cap[currency.toLowerCase()]}
            </Typography>
          </span>
        </div>
      </div>
      {/* <CoinChart key={coin} /> */}
    </div>
  );
}

export default CoinPage;
