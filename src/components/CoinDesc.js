import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import parser from "html-react-parser";

const useStyles = makeStyles((theme) => ({
  description: {
    padding: 25,
    textAlign: "justify",
    fontFamily: "VT323",
  },
}));
function CoinDesc({ coin }) {
  const classes = useStyles();
  return (
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
  );
}

export default CoinDesc;
