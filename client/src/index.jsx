import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Create from "./components/Create.jsx";
import MyRelease from "./components/MyRelease.jsx";
import Detail from "./components/Detail.jsx";
import App from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="create" element={<Create />} />
        <Route path="myrelease" element={<MyRelease />} />
        <Route path="detail/:addr" element={<Detail />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
