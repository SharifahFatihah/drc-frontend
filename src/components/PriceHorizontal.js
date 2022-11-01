import { makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Service from "../service/Service";
import { CryptoState } from "../CryptoContext";
import AliceCarousel from "react-alice-carousel";
import { useNavigate } from "react-router-dom";

const useStyle = makeStyles(() => ({
  priceh: {
    height: "30px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollElement: {
    display: "flex",
    justifyContent: "center",
  },
  red: {
    color: "#FF4B25",
  },
  green: {
    color: "#00FF19",
  },
}));

function PriceHorizontal() {
  const classes = useStyle();
  const navigate = useNavigate();

  const { currency } = CryptoState();

  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTrendingCoins = (e) => {
    setLoading(true);

    Service.getTrendingCoins(e)
      .then((response) => {
        setTrending(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    getTrendingCoins(currency);
  }, [currency]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const responsive = { 0: { items: 4 }, 512: { items: 6 } };

  const items = trending.map((coin) => {
    return (
      <div
        className={classes.scrollElement}
        onClick={() => navigate(`/coins/${coin.id}`)}
      >
        <div>{coin?.symbol.toUpperCase()} &thinsp; &thinsp; </div>
        <div
          className={
            coin?.price_change_percentage_24h > 0 ? classes.green : classes.red
          }
        >
          {parseFloat(coin?.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>
    );
  });
  return (
    <div className={classes.priceh}>
      <AliceCarousel
        mouseTracking
        infinite={true}
        autoPlay={true}
        autoPlayInterval={0}
        animationDuration={10000}
        disableDotsControls
        disableButtonsControls={true}
        responsive={responsive}
        items={items}
      />
    </div>
  );
}

export default PriceHorizontal;
