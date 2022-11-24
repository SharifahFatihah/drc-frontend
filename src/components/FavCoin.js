import { Button, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import CoinPic from "../asset/fav-coin.gif";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    padding: 50,
    [theme.breakpoints.down("md")]: {
      flexDirection: "column-reverse",
      alignItems: "center",
      marginLeft: "0",
      marginRight: "0",
      paddingRight: "0",
      paddingLeft: "0",
    },
  },
  left: {
    width: "50%",
    padding: 50,
    [theme.breakpoints.down("md")]: {
      alignItems: "center",
      padding: 0,
    },
  },
  right: {
    padding: 50,
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  favCoinLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    [theme.breakpoints.down("md")]: {
      alignItems: "center",
      justifyContent: "center",
    },
  },
  favCoinSub: {
    fontFamily: "VT323",
    color: "white",
    marginLeft: 150,
    marginBottom: 50,
    fontSize: "50px",
    [theme.breakpoints.down("md")]: {
      fontSize: "34px",
    },
  },
  favGif: {
    height: "500px",
    [theme.breakpoints.down("md")]: {
      height: "auto",
      width: "350px",
      display: "flex",
    },
  },
}));

function FavCoin() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {" "}
          <div className={classes.favCoinLeft}>
            <Typography
              variant="h2"
              style={{
                fontFamily: "VT323",
                color: "#FFE227",
                marginBottom: 50,
                marginLeft: 150,
              }}
            >
              Favourite Coins
            </Typography>
            <Typography className={classes.favCoinSub}>
              Save and monitor your favourite coins performance in one place
            </Typography>
            <Button
              variant="contained"
              style={{
                marginLeft: 150,
                backgroundColor: "#FFE227",
                color: "black",
                border: "5px solid white",
                fontFamily: "VT323",
                fontSize: 20,
              }}
            >
              Add Now
            </Button>
          </div>
        </div>
      </div>
      <div className={classes.right}>
        <img src={CoinPic} alt="coin pic" className={classes.favGif} />
      </div>
    </div>
  );
}

export default FavCoin;
