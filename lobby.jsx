import React, { useState } from "react";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";

export default function Lobby(){
  const [mode, setMode] = useState(null);

  if(mode === "create") return <CreateRoom onBack={() => setMode(null)} />;
  if(mode === "join") return <JoinRoom onBack={() => setMode(null)} />;

  return (
    <div className="lobby">
      <h1>Impostor — Lobby</h1>
      <div className="lobby-buttons">
        <button onClick={() => setMode("create")}>Utwórz pokój</button>
        <button onClick={() => setMode("join")}>Dołącz do pokoju</button>
      </div>
      <p className="hint">Host nie bierze udziału w grze — tworzy pokój i zarządza rundami.</p>
    </div>
  );
}
