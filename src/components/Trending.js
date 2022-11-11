import { Typography } from "@material-ui/core";
import React from "react";
import ScrollHorizontal from "../components/ScrollHorizontal";

function Trending() {
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
        variant="h2"
        style={{
          marginBottom: 5,
          paddingRight: 20,
          paddingLeft: 20,
          fontFamily: "VT323",
          color: "#FFE227",
          marginBottom: 50,
        }}
      >
        Popular Coins
      </Typography>
      <ScrollHorizontal />
    </div>
  );
}

export default Trending;
