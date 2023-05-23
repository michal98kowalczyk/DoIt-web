import React, { useState, useEffect } from "react";
import HeaderLoggedIn from "./HeaderLoggedIn";
import HeaderLoggedOut from "./HeaderLoggedOut";
import "./Header.css";

const Header = () => {
  const isLoggedIn = !!sessionStorage.getItem("user");
  const user = isLoggedIn ? JSON.parse(sessionStorage.getItem("user")) : null;
  useEffect(() => {}, []);

  return (
    <>
      {isLoggedIn ? (
        <HeaderLoggedIn
          userRole={user && user.role}
          name={user && `${user.firstName} ${user.lastName}`}
        />
      ) : (
        <HeaderLoggedOut />
      )}
    </>
  );
};
export default Header;
