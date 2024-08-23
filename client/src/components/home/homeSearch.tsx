"use client";
import React, { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import SearchInput from "./searchInput";
import Image from "next/image";
import { site } from "@/app/siteSettings";

interface HomeSearchProps {}

const HomeSearch: React.FC<HomeSearchProps> = () => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const getGeo = async () => {
    try {
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const ip = ipData.ip;

      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      const geoData = await geoResponse.json();

      setCity(geoData.city);
    } catch (error) {
      console.error("Error fetching geolocation data:", error);
    }
  };

  useEffect(() => {
    getGeo();
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center">
      <div className="absolute w-6/12 hidden md:block ml-auto inset-0 overflow-hidden">
        <Image
          src={site.imgs.homeCover}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt="Background image"
        />
      </div>

      <div className="z-10 flex flex-col relative px-4 w-full md:w-9/12 sm:px-10 md:pl-20 pb-32">
        <div className="text-3xl md:text-xl lg:text-6xl font-bold">
          <div>
            Trouver&nbsp;
            <Typewriter
              words={[
                "enseignantes",
                "développeurs",
                "plombières",
                "designers",
                "gardeners",
                "tout",
              ]}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
            <br />
            rendue facile.
          </div>
        </div>
        <div className="w-full mt-4 md:mt-6">
          <SearchInput
            search={search}
            setSearch={setSearch}
            city={city}
            setCity={setCity}
          />
        </div>
        <p className="text-xs text-gray-500 mt-4 md:mt-6">
          Essayez de rechercher un plombier, un bricoleur, un paysagiste ou un
          électricien.
        </p>
      </div>
    </div>
  );
};

export default HomeSearch;
