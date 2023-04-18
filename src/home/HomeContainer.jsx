import React from "react";
import UserHome from "./UserHome";
import Home from "./Home";

const HomeContainer = () => {
  const isLoggedIn = !!sessionStorage.getItem("user");

  return <>{isLoggedIn ? <UserHome /> : <Home />}</>;
};
export default HomeContainer;
