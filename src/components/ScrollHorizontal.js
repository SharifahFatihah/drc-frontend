import { makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Service from "../service/Service";
import { CryptoState } from "../CryptoContext";
import AliceCarousel from "react-alice-carousel";
import { useNavigate } from "react-router-dom";

const useStyle = makeStyles(() => ({
  scrollh: {
    height: "50%",
    width: "70%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollElement: {
    boxShadow: "0px 0px 105px 45px 0px 0px 105px 45px ",
  },
}));

function ScrollHorizontal() {
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

  const responsive = { 0: { items: 2 }, 512: { items: 4 } };

  const items = trending.map((coin) => {
    return (
      <div
        className={classes.scrollElement}
        onClick={() => navigate(`/coins/${coin.id}`)}
      >
        <img src={coin?.image} alt={coin.name} height="150" />
      </div>
    );
  });
  return (
    <div className={classes.scrollh}>
      <AliceCarousel
        mouseTracking
        infinite={true}
        autoPlay={true}
        autoPlayInterval={2000}
        animationDuration={2000}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
      />
    </div>
  );
}

export default ScrollHorizontal;
