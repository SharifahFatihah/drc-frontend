import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import Service from "../service/Service";
import { Button, Card, makeStyles, Paper } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import CoinChart from "../components/CoinChart";
import { LinearProgress } from "@material-ui/core";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import CoinDesc from "../components/CoinDesc";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  mainbar: {
    width: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
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
    fontFamily: "VT323",
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
      alignItems: "center",
    },
  },
  coinBasic: {
    display: "flex",
    alignItems: "center",
  },
  scoreContainerRed: {
    display: "flex",
    margin: 20,
    backgroundColor: "red",
    color: "black",
  },
  scoreContainerGreen: {
    display: "flex",
    margin: 20,
    backgroundColor: "#3EFF47",
    color: "black",
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
  console.log(coin);

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={coin?.image.large} alt={coin?.name} height="150" />
          <div style={{ marginLeft: 20 }}>
            <Typography variant="h3">{coin?.symbol.toUpperCase()}</Typography>
            <Typography variant="h4">{coin?.name}</Typography>
          </div>
          <Card
            style={{
              display: "flex",
              justifyContent: "center",
              height: 30,
              width: 50,
              margin: 20,
              backgroundColor: "#FFE227",
              color: "black",
              fontSize: 30,
            }}
          >
            <div style={{ fontFamily: "VT323", padding: 0 }}>
              #{coin?.market_cap_rank}
            </div>
          </Card>
        </div>

        <div className={classes.coinBasicContainer}>
          <span className={classes.coinBasic}></span>

          <span className={classes.coinBasic}>
            <Typography variant="h5" className={classes.description}>
              Market Cap: {symbol}
              {coin?.market_data.market_cap[currency.toLowerCase()]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                .slice(0, -8)}
              {" Million "}
            </Typography>
          </span>
          <span className={classes.coinBasic}>
            <Typography variant="h5" className={classes.description}>
              Circulating Supply:{" "}
              {coin?.market_data?.circulating_supply
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                .slice(0, -8)}
              {" Million "}
            </Typography>
          </span>
          <span className={classes.coinBasic}>
            <Typography variant="h5" className={classes.description}>
              Total Supply:{" "}
              {coin?.market_data.total_supply
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                .slice(0, -8)}
              {" Million "}
            </Typography>
          </span>
          <span className={classes.coinBasic}>
            <Typography variant="h5" className={classes.description}>
              Max Supply:{" "}
              {coin?.market_data.max_supply
                ? coin?.market_data.max_supply.toString().slice(0, -6)
                : "-"}
              {" Million "}
            </Typography>
          </span>

          <Button
            variant="outlined"
            style={{
              backgroundColor: "#FFE227",
              color: "black",
              width: "90%",
              height: 40,
              marginBottom: 20,
            }}
          >
            <a
              href={coin?.links?.homepage[0]}
              style={{ color: "black", fontFamily: "VT323" }}
            >
              Visit Website
            </a>
          </Button>

          {user && (
            <Button
              style={{
                width: "90%",
                height: 40,
                backgroundColor: "#FFE227",
                fontFamily: "VT323",
              }}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchList}
            >
              {inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            </Button>
          )}
        </div>
      </div>
      <div className={classes.mainbar}>
        <CoinChart coin={coin} />
        <CoinDesc coin={coin} />
      </div>
    </div>
  );
}

export default CoinPage;
