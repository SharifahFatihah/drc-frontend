import { Typography, makeStyles } from "@material-ui/core";
import React from "react";
import ScrollHorizontal from "./ScrollHorizontal";
import TrendHorizontal from "./TrendHorizontal";
import Pacman from "../asset/all-coins.gif";

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
    width: "30%",
    padding: 50,
    [theme.breakpoints.down("md")]: {
      // alignItems: "center",
      padding: "0",
    },
  },
  right: {
    marginRight: 50,
    marginTop: 70,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "50%",
    },
  },
  leftSub: {
    paddingRight: 20,
    paddingLeft: 20,
    fontFamily: "VT323",
    color: "white",
    marginBottom: 50,
    fontSize: "50px",
    [theme.breakpoints.down("md")]: {
      fontSize: "34px",
      paddingRight: 0,
      paddingLeft: 0,
    },
  },
}));

function Trending2() {
  const classes = useStyles();

  return (
    <div
      style={{
        marginTop: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className={classes.container}>
        <div className={classes.left}>
          <Typography
            variant="h1"
            style={{
              marginBottom: 5,
              paddingRight: 20,
              paddingLeft: 20,
              fontFamily: "VT323",
              color: "#FFE227",
              marginBottom: 50,
            }}
          >
            Coins
          </Typography>
          <Typography
            variant="h3"
            style={{
              marginBottom: 5,
              paddingRight: 20,
              paddingLeft: 20,
              fontFamily: "VT323",
              color: "white",
              marginBottom: 50,
            }}
          >
            Top trending coins searched by users
          </Typography>
        </div>
        <div className={classes.right}>
          <img src={Pacman} alt="pacman eating coins" width={800} />
        </div>
      </div>

      <TrendHorizontal />
    </div>
  );
}

export default Trending2;
