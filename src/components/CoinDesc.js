import { Typography, makeStyles } from "@material-ui/core";

import React from "react";
import parser from "html-react-parser";

const useStyles = makeStyles((theme) => ({
  description: {
    padding: 15,
    textAlign: "justify",
    fontFamily: "VT323",
  },
  descbox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
    padding: 20,
    marginLeft: 60,
    borderRadius: "15px",
    background: "rgba(79, 58, 84, 0.52)",
    minHeight: "185px",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      display: "flex",
      width: "90%",
      marginTop: 40,
      marginLeft: 0,
      padding: 10,
      alignItems: "center",
      justifyContent: "space-evenly",
    },
  },
}));
function CoinDesc({ coin }) {
  const classes = useStyles();
  return (
    <div className={classes.descbox}>
      <div style={{ width: "90%" }}>
        <Typography variant="h3" className={classes.description}>
          What is {coin?.name} ?
        </Typography>
        <Typography
          variant="subtitle1"
          className={classes.description}
          style={{ fontFamily: "Inter" }}
        >
          {parser(`${coin?.description.en.split(". ").slice(0, 6).join(". ")}`)}
        </Typography>
      </div>
    </div>
  );
}

export default CoinDesc;
