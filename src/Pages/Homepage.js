import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import Memories from "../asset/memories.mp3";
import Kiki from "../asset/kiki.mp3";
import Sound from "react-sound";
import PriceHorizontal from "../components/PriceHorizontal";
import CoinTable from "../components/CoinTable";
import MockTable from "../components/MockTable";

function Homepage() {
  return (
    <div>
      <Sound
        url={Kiki}
        playStatus={Sound.status.PLAYING}
        playFromPosition={0 /* in milliseconds */}
      />
      <PriceHorizontal />
      <Banner />
      <CoinTable />
    </div>
  );
}

export default Homepage;
