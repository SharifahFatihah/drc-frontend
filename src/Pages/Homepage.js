import React from "react";
import Banner from "../components/Banner";
import Kiki from "../asset/kiki.mp3";
import Sound from "react-sound";
import Trending from "../components/Trending";
import GlobalMarket from "../components/GlobalMarket";
import FavCoin from "../components/FavCoin";

function Homepage() {
  // let ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

  // ws.onmessage = (e) => {
  //   console.log(e.data);
  // };

  return (
    <div>
      <Sound
        url={Kiki}
        playStatus={Sound.status.PLAYING}
        playFromPosition={0 /* in milliseconds */}
      />
      <Banner />
      <Trending />
      <GlobalMarket />
      <FavCoin />
    </div>
  );
}

export default Homepage;
