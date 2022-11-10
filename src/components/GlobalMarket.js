import { Typography } from "@material-ui/core";
import { ConstructionOutlined } from "@mui/icons-material";
import React from "react";
import { CryptoState } from "../CryptoContext";
import ScrollHorizontal from "./ScrollHorizontal";

function GlobalMarket() {
  const { globalInfo } = CryptoState();

  console.log(globalInfo);

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
        Global Market
      </Typography>
    </div>
  );
}

export default GlobalMarket;
