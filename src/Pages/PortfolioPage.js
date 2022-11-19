import { makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { CryptoState } from "../CryptoContext";
import currentAssetIcon from "../asset/currentasseticon.png";
import Service from "../service/Service";
import { useNavigate } from "react-router-dom";
import PortfolioChart from "../components/PortfolioChart";
import { chartDays } from "../service/Service";
import HoldingModal from "../components/HoldingModal";

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
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    width: "85% ",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      justifyContent: "center",
    },
  },
  selectButton: {
    width: "15%",
    border: "1px solid #FFE227",
    borderRadius: 5,
    padding: 10,
    cursor: "pointer",
    marginLeft: 10,
    alignItems: "center",

    "&:hover": {
      backgroundColor: "#FFE227",
      color: "black",
    },
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    paddingLeft: 40,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      flexDirection: "column",
      justifyContent: "center",
    },
  },
}));

function PortfolioPage() {
  const { user, setAlert, watchlist, coins, currency, symbol } = CryptoState();

  const [userCoin, setUserCoin] = useState([]);
  const [userCoin2, setUserCoin2] = useState([]);
  const [userCoin3, setUserCoin3] = useState();
  const [period, setPeriod] = useState("price_change_percentage_24h");
  const [days, setDays] = useState(1);
  const [userCoins, setUserCoins] = useState();

  const [coinAlert, setCoinAlert] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const classes = useStyles();

  useEffect(() => {
    Promise.all(
      coins.map(async (coin) => {
        if (watchlist.includes(watchlist.find((e) => e.id === coin.id)))
          return Service.getSingleCoin(coin.id);
      })
    ).then((z) => {
      setUserCoin(z.filter((y) => !!y));
    });
  }, [watchlist]);

  useEffect(() => {
    userCoin.map((e) => setUserCoin2((userCoin2) => [...userCoin2, e.data]));
  }, [userCoin]);

  useEffect(() => {
    watchlist.map((e) =>
      userCoin2.map((z) => {
        e.id === z.id && (z.holding = e.holding);
      })
    );
    setUserCoin3([...new Map(userCoin2.map((m) => [m.id, m])).values()]);
  }, [userCoin2, watchlist]);

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
        e.market_data.price_change_percentage_24h < -5 &&
        setCoinAlert((coinAlert) => [
          ...coinAlert,
          {
            id: e.id,
            priceChange: e.market_data.price_change_percentage_24h,
          },
        ])
    );
  }, [userCoin2]);

  console.log("usercoin2", userCoin2);

  // console.log("alerts", coinAlert);
  // console.log("worst", worstPerformCoin);
  // console.log("top", topPerformCoin);
  // console.log("avg", avgPriceChange);
  // console.log("usercoin", userCoin2);

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
        {userCoin3?.map((coin) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
              }}
            >
              <div style={{ marginRight: 10 }}>
                <img src={coin?.image?.thumb} height="20" />
              </div>
              <div>{coin?.name}</div>

              <HoldingModal coin={coin} />
              <div>{coin.holding}</div>
            </div>
          );
        })}
      </div>
      <div className={classes.mainbar}>
        {userCoin2.length == 0 ? (
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "800px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            Youre Portfolio is empty
          </div>
        ) : (
          <div style={{ width: "100%", paddingTop: 40 }}>
            <div className={classes.titleContainer}>
              <Typography variant="h3" style={{ fontFamily: "VT323" }}>
                Portfolio
              </Typography>
              <div className={classes.buttonContainer}>
                {chartDays.map((e) => (
                  <div
                    key={e.value}
                    onClick={() => {
                      setDays(e.value);
                      setPeriod(e.api_period);
                    }}
                    className={classes.selectButton}
                    style={{
                      backgroundColor: e.value === days ? "#FFE227" : "",
                      color: e.value === days ? "black" : "",
                    }}
                  >
                    {e.label}
                  </div>
                ))}
              </div>
            </div>
            <PortfolioChart days={days} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;
