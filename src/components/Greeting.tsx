"use client";
import React, { useEffect, useState } from "react";

const Greeting = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);
  return <p className="ml-8 text-white font-normal text-sm">{greeting}</p>;
};

export default Greeting;
