import React from "react";
import CoinTable from "../components/CoinTable";
import Trending2 from "../components/Trending2";
import { CryptoState } from "../CryptoContext";

function CoinListPage() {
  

  return (
    <div>

      <Trending2 />
      <CoinTable />
    </div>
  );
}

export default CoinListPage;
