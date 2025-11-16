import React, { useEffect, useState } from "react";
import { db, doc, getDoc, updateDoc, onSnapshot } from "../firebase";

export default function PlayerPanel({ roomCode, room, playerNick }) {
  const [player, setPlayer] = useState(null);
  const [voteState, setVoteState] = useState(null); // 'voting' or null

  useEffect(() => {
    const p = room.players?.find(pl => pl.name === playerNick);
    setPlayer(p || null);
  }, [room, playerNick]);

  if(!player) return <div>Ładowanie gracza...</div>;

  const isImpostor = player.role === "impostor";
  const word = room.currentWord;

  const accuse = async (targetId) => {
    // ograniczenie: każdy może oskarżyć tylko raz -> sprawdź player.canAccuse
    if(!player.canAccuse) return alert("Możesz oskarżyć tylko raz na rundę.");
    // ustaw globalny "vote" jako rozpoczęte głosowanie: zapisujemy accusedId i markujemy auto-głos oskarżyciela
    const roomRef = doc(db, "rooms", roomCode);
    await updateDoc(roomRef, {
      vote: {
        accusedId: targetId,
        initiatorId: player.id,
        votes: { [player.id]: "TAK" }
      },
      // zablokuj możliwość oskarżania dla tej osoby
      players: room.players.map(pl => pl.id === player.id ? { ...pl, canAccuse: false } : pl)
    });
  };

  const castVote = async (choice) => {
    const roomRef = doc(db, "rooms", roomCode);
    const r = await getDoc(roomRef);
    if(!r.exists()) return;
    const data = r.data();
    const vote = data.vote || {};
    const votes = vote.votes || {};
    votes[player.id] = choice;
    await updateDoc(roomRef, { "vote.votes": votes });
  };

  return (
    <div className="player-panel">
      <h3>Jesteś: {player.name} {isImpostor ? "(IMPOSTOR)" : ""}</h3>
      <div className="word-box">
        {isImpostor ? <p className="impostor-msg">JESTEŚ IMPOSTOREM</p> : <p className="secret-word">Hasło: <strong>{word}</strong></p>}
      </div>

      <div className="accuse-section">
        <h4>Oskarżenie</h4>
        <p>Możesz oskarżyć jednego gracza na rundę.</p>
        <div className="players-list-small">
          {room.players.filter(p=>p.name !== player.name).map(p=>(
            <div key={p.id} className="player-row">
              <span>{p.name}</span>
              <button disabled={!player.canAccuse} onClick={()=>accuse(p.id)}>Oskarż</button>
            </div>
          ))}
        </div>
      </div>

      <div className="vote-section">
        <h4>Głosowanie</h4>
        <p>Jeżeli jest aktywne głosowanie, oddaj głos:</p>
        <div className="vote-buttons">
          <button onClick={()=>castVote("TAK")}>TAK</button>
          <button onClick={()=>castVote("NIE")}>NIE</button>
        </div>
      </div>
    </div>
  );
}
