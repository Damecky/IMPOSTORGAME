import React, { useState } from "react";
import Splash from "./components/Splash";
import Lobby from "./components/Lobby";

export default function App(){
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="app-root">
      {showSplash ? <Splash onFinish={() => setShowSplash(false)} /> : <Lobby />}
    </div>
  );
}
