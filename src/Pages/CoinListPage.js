import { Typography } from "@material-ui/core";
import React from "react";
import CoinTable from "../components/CoinTable";
import Trending2 from "../components/Trending2";
import { CryptoState } from "../CryptoContext";

function CoinListPage() {
  return (
    <div>
      <Trending2 />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 40,
          marginTop: 40,
        }}
      >
        <Typography
          variant="h3"
          style={{ fontFamily: "VT323", paddingLeft: 20, paddingRight: 20 }}
        >
          Search your favourite coin
        </Typography>
      </div>
      <CoinTable />
    </div>
  );
}

export default CoinListPage;
