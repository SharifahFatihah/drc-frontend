import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import Kiki from "../asset/kiki.mp3";
import Sound from "react-sound";
import Trending from "../components/Trending";
import GlobalMarket from "../components/GlobalMarket";

function Homepage() {
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
    </div>
  );
}

export default Homepage;
