import { makeStyles, TableContainer, Typography } from "@material-ui/core";
import React from "react";
import { CryptoState } from "../CryptoContext";
import bestperformanceicon from "../asset/bestperformanceicon.png";
import worstperformericon from "../asset/worstperformericon.png";
import bell from "../asset/alert-1.png";
import currentbalance from "../asset/current-balance .png";

const useStyles = makeStyles((theme) => ({
  alertContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingRight: 20,

    width: "24%",
    margin: 15,
    borderRadius: "15px",
    background: "rgba(79, 58, 84, 0.52)",
    minHeight: "185px",
    height: "100px",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingRight: 20,
    width: "24%",
    margin: 15,
    borderRadius: "15px",
    background: "rgba(79, 58, 84, 0.52)",
    minHeight: "185px",
  },
  marketContainer: {
    marginTop: 40,
    width: "90%",

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
    },
  },
}));

function Portfolioinfo({ avgPriceChange, topPerformCoin, Worst, alert }) {
  const classes = useStyles();
  const { currency, symbol } = CryptoState();

  const alerts = alert?.map((coin) => (
    <div style={{ display: "flex", alignItems: "center", padding: 5 }}>
      <img src={coin?.image?.small} height="30" style={{ marginRight: 10 }} />
      <Typography>{coin?.name}</Typography>
    </div>
  ));

  console.log("alerts", alert);

  return (
    <div
      style={{
        marginTop: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div className={classes.marketContainer}>
        <div
          className={classes.infoContainer}
          style={{ display: "flex", alignItems: "flex-start" }}
        >
          <img src={currentbalance} height="30" style={{ marginTop: 20 }} />
          <Typography style={{ width: "max-content", padding: 15 }}>
            Profit Estimation
          </Typography>
          <Typography
            style={{
              fontSize: 20,
              fontWeight: "bolder",
              display: "flex",
              width: "100%",
              justifyContent: "center",
            }}
          >
            {avgPriceChange ? avgPriceChange?.toFixed(2) : ""} {"%"}
          </Typography>
        </div>
        <div className={classes.infoContainer}>
          <img
            src={bestperformanceicon}
            alt="best coin Icon"
            height="30"
            style={{ marginTop: 20 }}
          />
          <Typography style={{ width: "max-content", padding: 10 }}>
            Top Performance Coin
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={topPerformCoin?.image?.large}
              height="30"
              style={{ marginRight: 10 }}
            />
            <Typography>{topPerformCoin?.name}</Typography>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            {symbol}
            {topPerformCoin?.market_data?.current_price[currency.toLowerCase()]}
          </div>
        </div>
        <div className={classes.infoContainer}>
          <img
            src={worstperformericon}
            alt="worst coin Icon"
            height="30"
            style={{ marginTop: 20 }}
          />
          <Typography style={{ width: "max-content", padding: 10 }}>
            Worst Performance Coin
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={Worst?.image?.large}
              height="30"
              style={{ marginRight: 10 }}
            />
            <Typography style={{}}>{Worst?.name}</Typography>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            {symbol}
            {Worst?.market_data?.current_price[currency.toLowerCase()]}
          </div>
        </div>
        <div className={classes.alertContainer}>
          <div>
            <img
              src={bell}
              alt="alert Icon"
              height="30"
              style={{ marginTop: 20 }}
            />
            <Typography style={{ width: "max-content", padding: 10 }}>
              Alert Coin
            </Typography>
          </div>
          <div style={{ width: "100%", overflowY: "scroll", height: "100px" }}>
            {alerts}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolioinfo;
