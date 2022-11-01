import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import Memories from "../asset/memories.mp3";
import Sound from "react-sound";
import PriceHorizontal from "../components/PriceHorizontal";

function Homepage() {
  return (
    <div>
      <Sound
        url={Memories}
        playStatus={Sound.status.PLAYING}
        playFromPosition={300 /* in milliseconds */}
      />
      <PriceHorizontal />
      <Banner />{" "}
    </div>
  );
}

export default Homepage;
