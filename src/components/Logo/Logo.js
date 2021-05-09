import React from "react";
import Tilt from "react-parallax-tilt";
import brain from "./brain.png";
import "./Logo.css";

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt
        tiltReverse={true}
        className="tilt br2 shadow-2"
        style={{ height: 150, width: 150 }}
      >
        <img style={{ paddingTop: "10px" }} alt="logo" src={brain} />
      </Tilt>
    </div>
  );
};

export default Logo;
