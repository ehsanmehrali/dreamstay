import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/* <Header />
<Footer /> */
/* <div className="layout">
  
  <Header />
  <main>
    <Outlet />
  </main>
  <Footer />
</div> */
