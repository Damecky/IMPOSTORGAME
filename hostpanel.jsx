import React, { useState } from "react";
import { db, doc, getDoc, updateDoc } from "../firebase";
import { WORDS } from "../data/words";

function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

export default function HostPanel({ roomCode, room }) {
  const [locked, setLocked] = useState(false);

  const distributeRoles = async () => {
    if(!room.players || room.players.length < 3) return alert("Potrzeba minimum 3 graczy.");
    setLocked(true);

    // Wybierz hasło i impostora
    const word = pickRandom(WORDS);
    const impostorIndex = Math.floor(Math.random() * room.players.length);
    const playersWithRoles = room.players.map((p, idx) => ({
      ...p,
      role: idx === impostorIndex ? "impostor" : "player",
      canAccuse: true,
      accused: false
    }));

    const roomRef = doc(db, "rooms", roomCode);
    await updateDoc(roomRef, {
      players: playersWithRoles,
      currentWord: word,
      impostorId: playersWithRoles[impostorIndex].id,
      roundState: "roles_assigned",
      votes: {},
      lastRoundResult: null
    });
    alert("Role rozlosowano. Teraz kliknij START RUNDY gdy gracze będą gotowi.");
    setLocked(false);
  };

  const startRound = async () => {
    const roomRef = doc(db, "rooms", roomCode);
    await updateDoc(roomRef, { roundState: "running", roundStartedAt: Date.now() });
  };

  const nextRound = async () => {
    // przy zakładaniu nowej rundy: zmiana hasła, pozbycie się oskarżeń, ale zapisz punktację (scores w dokumencie)
    // Tu zrobimy prostą implementację: zwiększamy numer rundy i ustawiamy stan waiting
    const roomRef = doc(db, "rooms", roomCode);
    await updateDoc(roomRef, {
      roundState: "waiting",
      currentWord: null,
      impostorId: null,
      players: room.players.map(p => ({ ...p, accused: false, canAccuse: true }))
    });
  };

  return (
    <div className="host-panel">
      <h3>Panel hosta</h3>
      <p>Kod pokoju: <strong>{roomCode}</strong></p>
      <p>Punkty:</p>
      <ul>
        {Object.entries(room.scores || {}).map(([k,v]) => <li key={k}>{k}: {v}</li>)}
      </ul>

      <div className="host-controls">
        <button onClick={distributeRoles}>Rozdaj role</button>
        <button onClick={startRound}>Start rundy</button>
        <button onClick={nextRound}>Rozlosuj kolejną rundę</button>
      </div>

      <div className="host-info">
        <p>Stan rundy: {room.roundState}</p>
        {room.roundState === "running" && <p>Hasło (nie jest widoczne dla hosta/systemu): tylko dla graczy</p>}
        {room.roundState === "roles_assigned" && <p>Role rozdane — czekaj na Start rundy</p>}
      </div>
    </div>
  );
}
