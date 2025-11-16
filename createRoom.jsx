import React, { useState } from "react";
import { db, doc, setDoc, serverTimestamp } from "../firebase";

function genCode(){
  return String(Math.floor(1000 + Math.random() * 9000));
}

export default function CreateRoom({ onBack }) {
  const [code, setCode] = useState(null);
  const [hostName, setHostName] = useState("");

  const create = async () => {
    const roomCode = genCode();
    setCode(roomCode);
    const roomRef = doc(db, "rooms", roomCode);
    await setDoc(roomRef, {
      hostName: hostName || "Host",
      hostCreatedAt: serverTimestamp(),
      players: [],
      hostId: "HOST", // oznaczamy, że host jest specjalny
      state: "waiting",
      rounds: [],
      scores: {}
    });
  };

  return (
    <div className="create-room">
      {!code ? (
        <>
          <h2>Utwórz pokój</h2>
          <input placeholder="Twoje imię (host)" value={hostName} onChange={e=>setHostName(e.target.value)} />
          <div className="row">
            <button onClick={create}>Utwórz</button>
            <button onClick={onBack}>Anuluj</button>
          </div>
        </>
      ) : (
        <>
          <h2>Pokój utworzony</h2>
          <p>Kod: <strong>{code}</strong></p>
          <p>Przekaż ten kod graczom — oni dołączą przez ekran "Dołącz do pokoju".</p>
          <HostPanel roomCode={code} />
        </>
      )}
    </div>
  );
}

// import HostPanel tutaj, by uniknąć cyklicznych importów
import HostPanel from "./HostPanel";
