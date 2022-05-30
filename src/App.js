import React from "react";
import AutoStart from "./components/AutoStart";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route path="/autostart" render={() => <AutoStart />} />
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
