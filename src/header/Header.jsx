import React, { useState, useEffect } from "react";
import HeaderLoggedIn from "./HeaderLoggedIn";
import HeaderLoggedOut from "./HeaderLoggedOut";
import "./Header.css";

const Header = () => {
  const isLoggedIn = !!sessionStorage.getItem("user");
  // const isLoggedIn = false;

  useEffect(() => {
    console.log("Header ", isLoggedIn);
  }, []);

  return <>{isLoggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}</>;
};
export default Header;
