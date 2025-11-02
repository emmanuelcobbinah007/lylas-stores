import React from "react";
import Image from "next/image";
import LylaPic from "../../public/LylaPic.jpg";

const Hero = () => {
  return (
    <div className="relative">
      <div className="relative">
        <Image
          src={LylaPic}
          alt="Lyla"
          className="w-full h-[80vh] object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default Hero;
