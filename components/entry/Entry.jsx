import React from "react";
import "./entry.css";
import Image from "next/image";
import { Neuo, zentry } from "../../app/font";

const Entry = () => {
  return (
    <div className="entry-main">
      <div className="entry-main-container">
        <Image
          src="/entry.gif"
          alt="Entry GIF"
          fill
          style={{ objectFit: "cover", borderRadius: "20px", transform: "scale(1.1)", zIndex: 1 }}
          priority
        />
        <p className={`entry-main-container-tagline ${Neuo.className}`}>Join now and pretend<br /> <span className={zentry.className}>you’re <br /> organized.</span>.</p>
      </div>
    </div>
  );
};

export default Entry;
