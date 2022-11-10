import React from "react";
import ChromeDinoGame from "react-chrome-dino";

function PageNotFound() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 40,
        }}
      >
        <h1>Error Page not Found </h1>
      </div>
      <ChromeDinoGame />
    </div>
  );
}

export default PageNotFound;
