import { Button, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import CoinPic from "../asset/coinpic.png";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    padding: 50,

    [theme.breakpoints.down("md")]: {
      flexDirection: "column-reverse",
      alignItems: "center",
    },
  },
  left: {
    width: "50%",
    padding: 50,
  },
  right: {
    width: "50%",
    padding: 50,
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="h2"
              style={{
                paddingRight: 20,
                paddingLeft: 20,
                fontFamily: "VT323",
                color: "#FFE227",
                marginBottom: 50,
              }}
            >
              Favourite Coins
            </Typography>
            <Typography
              variant="h5"
              style={{
                paddingRight: 20,
                paddingLeft: 20,
                fontFamily: "Inter",
                color: "white",
                marginBottom: 50,
              }}
            >
              Save and monitor your favourite coins performance in one place
            </Typography>
            <Button
              variant="contained"
              style={{
                marginLeft: 25,
                backgroundColor: "#FFE227",
                color: "black",
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
        <img src={CoinPic} alt="coin pic" height={400} />
      </div>
    </div>
  );
}

export default FavCoin;
