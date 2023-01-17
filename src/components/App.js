import React, { useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Jwitter</footer>
    </>
  );
};

export default App;
