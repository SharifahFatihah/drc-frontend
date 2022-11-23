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
import CoinStats from "../components/CoinStats";
import favouriteIcon from "../asset/favouriteicon.png";
import unfavouriteIcon from "../asset/unfavouriteicon.png";
import githubIcon from "../asset/github.png";
import redditIcon from "../asset/reddit.png";
import announcementIcon from "../asset/announcement.png";
import CoinConverter from "../components/CoinConverter";

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
    [theme.breakpoints.down("md")]: {
      width: "100%",
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

  const { currency, symbol, user, watchlist, setAlert, setOpen } =
    CryptoState();

  const handleOpen = () => setOpen(true);

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

  const inWatchlist = watchlist.includes(
    watchlist.find((e) => e.id === coin?.id)
  );

  const addToWatchList = async () => {
    const coinRef = await doc(db, "watchlist", user.uid);

    try {
      await setDoc(coinRef, {
        coins: watchlist
          ? [...watchlist, { id: coin.id, holding: 1 }]
          : [{ id: coin.id, holding: 1 }],
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
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 25 }}
        >
          <img src={coin?.image.large} alt={coin?.name} height="110" />
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
          {user ? (
            inWatchlist ? (
              <img
                src={favouriteIcon}
                height="30rem"
                onClick={inWatchlist ? removeFromWatchlist : addToWatchList}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <img
                src={unfavouriteIcon}
                height="30rem"
                onClick={inWatchlist ? removeFromWatchlist : addToWatchList}
                style={{ cursor: "pointer" }}
              />
            )
          ) : (
            <img
              src={unfavouriteIcon}
              height="30rem"
              onClick={handleOpen}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>

        <div className={classes.coinBasicContainer}>
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
                ? coin?.market_data.total_supply
                    ?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    .slice(0, -8)
                : "-"}
              {coin?.market_data.total_supply && " Million "}
            </Typography>
          </span>
          <span className={classes.coinBasic}>
            <Typography variant="h5" className={classes.description}>
              Max Supply:{" "}
              {coin?.market_data.max_supply
                ? coin?.market_data.max_supply.toString().slice(0, -6)
                : "-"}
              {coin?.market_data.max_supply && " Million "}
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
              marginTop: 20,
            }}
          >
            <a
              href={coin?.links?.homepage[0]}
              style={{ color: "black", fontFamily: "VT323", fontSize: 20 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website
            </a>
          </Button>

          <div style={{ width: "90%", display: "flex" }}>
            {coin?.links?.repos_url?.github[0] && (
              <Button
                variant="outlined"
                style={{
                  backgroundColor: "#5F5F5F",

                  width: "90%",
                  height: 40,
                  margin: 5,
                }}
              >
                <a
                  href={coin?.links?.repos_url?.github[0]}
                  style={{ display: "flex" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={githubIcon} alt="github icon" height={20} />
                </a>
              </Button>
            )}

            {coin?.links?.subreddit_url && (
              <Button
                variant="outlined"
                style={{
                  backgroundColor: "#FF5733",
                  color: "black",
                  width: "90%",
                  height: 40,
                  margin: 5,
                }}
              >
                <a
                  href={coin?.links?.subreddit_url}
                  style={{ display: "flex" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={redditIcon} alt="reddit icon" height={20} />
                </a>
              </Button>
            )}

            {coin?.links?.announcement_url[0] && (
              <Button
                variant="outlined"
                style={{
                  backgroundColor: "#626FC2",
                  color: "black",
                  width: "90%",
                  height: 40,
                  margin: 5,
                }}
              >
                <a
                  href={coin?.links?.announcement_url[0]}
                  style={{ display: "flex" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={announcementIcon}
                    alt="announcement icon"
                    height={20}
                  />
                </a>
              </Button>
            )}
          </div>

          <CoinConverter coin={coin} />
        </div>
      </div>
      <div className={classes.mainbar}>
        <CoinChart coin={coin} />
        <CoinDesc coin={coin} />
        <CoinStats coin={coin} />
      </div>
    </div>
  );
}

export default CoinPage;
