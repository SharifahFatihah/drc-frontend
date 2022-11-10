import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import Service from "../service/Service";
import { Button, makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import parser from "html-react-parser";
import CoinChart from "../components/CoinChart";
import { LinearProgress } from "@material-ui/core";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

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
      width: "100%",
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
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
    },
  },
  coinBasic: {
    display: "flex",
    alignItems: "center",
  },
}));

function CoinPage() {
  const classes = useStyles();
  const navigate = useNavigate();

  const { id } = useParams();
  const [coin, setCoin] = useState();
  const [loading, setLoading] = useState(false);

  const { currency, symbol, user, watchlist, setAlert } = CryptoState();

  const getSingleCoin = (e) => {
    setLoading(true);

    Service.getSingleCoin(e)
      .then((response) => {
        setCoin(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        navigate(`*`);
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

  if (!coin) {
    return (
      <div>
        <LinearProgress />
      </div>
    );
  }

  const inWatchlist = watchlist.includes(coin?.id);

  const addToWatchList = async () => {
    const coinRef = await doc(db, "watchlist", user.uid);

    try {
      await setDoc(coinRef, {
        coins: watchlist ? [...watchlist, coin.id] : [coin.id],
      });

      setAlert({
        open: true,
        message: `${coin.name} added to your watchlist`,
        type: "success",
      });
    } catch (error) {}
  };

  const removeFromWatchlist = async () => {
    const coinRef = await doc(db, "watchlist", user.uid);

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((watch) => watch !== coin?.id),
        },
        { merge: "true" }
      );

      setAlert({
        open: true,
        message: `${coin.name} remove from your watchlist`,
        type: "success",
      });
    } catch (error) {}
  };

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
          <span className={classes.coinBasic}></span>
          <span className={classes.coinBasic}>
            <Typography variant="h5" className={classes.description}>
              Market Cap: {symbol}
              {coin?.market_data.market_cap[currency.toLowerCase()]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                .slice(0, -8)}
              {"M "}
            </Typography>
          </span>

          {user && (
            <Button
              variant="outlined"
              style={{ width: "100%", height: 40, backgroundColor: "pink" }}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchList}
            >
              {inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            </Button>
          )}
        </div>
      </div>
      <CoinChart coin={coin} />
    </div>
  );
}

export default CoinPage;
