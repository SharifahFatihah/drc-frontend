import { makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { CryptoState } from "../CryptoContext";
import currentAssetIcon from "../asset/currentasseticon.png";
import Service from "../service/Service";
import { useNavigate } from "react-router-dom";
import PortfolioChart from "../components/PortfolioChart";
import Portfolioinfo from "../components/Portfolioinfo";

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
}));

function PortfolioPage() {
  const { user, setAlert, watchlist, coins, currency, symbol } = CryptoState();

  const [userCoin, setUserCoin] = useState([]);
  const [userCoin2, setUserCoin2] = useState([]);
  const [period, setPeriod] = useState("market_cap_change_percentage_24h");
  const [coinAlert, setCoinAlert] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const classes = useStyles();

  useEffect(() => {
    Promise.all(
      coins.map(async (coin) => {
        if (watchlist.includes(coin.id)) return Service.getSingleCoin(coin.id);
      })
    ).then((z) => {
      setUserCoin(z.filter((y) => !!y));
    });
  }, [watchlist]);

  useEffect(() => {
    userCoin.map((e) => setUserCoin2((userCoin2) => [...userCoin2, e.data]));
  }, [userCoin]);

  const avgPriceChange =
    userCoin2.length > 0 &&
    userCoin2?.reduce((sum, coin) => {
      return (sum + coin?.market_data[period]) / userCoin2.length;
    }, 0);

  const topPerformCoin =
    userCoin2.length > 0 &&
    userCoin2?.reduce((prev, current) => {
      return prev?.market_data[period] > current?.market_data[period]
        ? prev
        : current;
    });
  const worstPerformCoin =
    userCoin2.length > 0 &&
    userCoin2?.reduce((prev, current) => {
      return prev?.market_data[period] < current?.market_data[period]
        ? prev
        : current;
    });

  useEffect(() => {
    userCoin2.map(
      (e) =>
        e.market_data.market_cap_change_percentage_24h < -5 &&
        setCoinAlert((coinAlert) => [...coinAlert, e])
    );
  }, [userCoin2]);

  console.log("alerts", coinAlert);
  console.log("worst", worstPerformCoin);
  console.log("top", topPerformCoin);
  console.log("avg", avgPriceChange);
  console.log("usercoin", userCoin2);

  const userCoins = coins.map((coin) => {
    if (watchlist.includes(coin.id))
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <div style={{ marginRight: 10 }}>
            <img src={coin?.image} height="20" />
          </div>
          <div>{coin?.name}</div>
        </div>
      );
  });

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={currentAssetIcon} height="30" style={{ marginRight: 20 }} />
          <div>
            <Typography variant="h3" style={{ fontFamily: "VT323" }}>
              Current Asset
            </Typography>
          </div>
        </div>
        {userCoins}
      </div>
      <div className={classes.mainbar}>
        <Portfolioinfo
          avgPriceChange={avgPriceChange}
          topPerformCoin={topPerformCoin}
          Worst={worstPerformCoin}
          alert={coinAlert}
        />
        <PortfolioChart />
      </div>
    </div>
  );
}

export default PortfolioPage;
