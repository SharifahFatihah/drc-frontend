import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import Kiki from "../asset/kiki.mp3";
import Sound from "react-sound";
import PriceHorizontal from "../components/PriceHorizontal";
import Trending from "../components/Trending";

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
      <Trending />
    </div>
  );
}

export default Homepage;
