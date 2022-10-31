import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import Service from "../service/Service";

function CoinPage() {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const [loading, setLoading] = useState(false);

  const { currency, symbol } = CryptoState();

  const getSingleCoin = (e) => {
    setLoading(true);

    Service.getSingleCoin(e)
      .then((response) => {
        setCoin(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    getSingleCoin(id);
  }, [currency]);

  console.log(coin);

  return <div>CoinPage</div>;
}

export default CoinPage;
