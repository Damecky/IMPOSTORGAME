import React, { useState } from "react";
import { db, doc, getDoc, updateDoc } from "../firebase";
import Room from "./Room";

export default function JoinRoom({ onBack }) {
  const [nick, setNick] = useState("");
  const [code, setCode] = useState("");
  const [joined, setJoined] = useState(false);
  const [roomCode, setRoomCode] = useState(null);

  const join = async () => {
    if(!nick || code.length !== 4) return alert("Podaj nick i 4 cyfrowy kod pokoju.");
    const roomRef = doc(db, "rooms", code);
    const snapshot = await getDoc(roomRef);
    if(!snapshot.exists()) return alert("Pokój nie istnieje.");
    const room = snapshot.data();

    if(room.players?.length >= 10) return alert("Pokój jest pełny (10 graczy).");

    // dodaj gracza
    const newPlayer = {
      id: `${Date.now()}_${Math.floor(Math.random()*1000)}`,
      name: nick,
      avatar: Math.floor(Math.random()*8), // index avatara
      score: 0,
      accused: false
    };
    const players = room.players ? [...room.players, newPlayer] : [newPlayer];
    await updateDoc(roomRef, { players });

    setRoomCode(code);
    setJoined(true);
  };

  if(joined) return <Room roomCode={roomCode} playerNick={nick} />;
  return (
    <div className="join-room">
      <h2>Dołącz do pokoju</h2>
      <input placeholder="Twoje imię" value={nick} onChange={e=>setNick(e.target.value)} />
      <input placeholder="Kod pokoju (4 cyfry)" value={code} onChange={e=>setCode(e.target.value)} maxLength={4}/>
      <div className="row">
        <button onClick={join}>Dołącz</button>
        <button onClick={onBack}>Powrót</button>
      </div>
    </div>
  );
}
