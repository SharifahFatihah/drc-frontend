import { Typography } from "@material-ui/core";
import React from "react";
import ScrollHorizontal from "./ScrollHorizontal";
import TrendHorizontal from "./TrendHorizontal";

function Trending2() {
  return (
    <div
      style={{
        marginTop: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
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
          color: "#FFE227",
          marginBottom: 50,
        }}
      >
        Top trending coins searched by users
      </Typography>
      <TrendHorizontal />
    </div>
  );
}

export default Trending2;
