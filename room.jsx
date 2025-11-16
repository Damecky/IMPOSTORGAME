import React, { useEffect, useState } from "react";
import { db, doc, onSnapshot, updateDoc, getDoc } from "../firebase";
import HostPanel from "./HostPanel";
import PlayerPanel from "./PlayerPanel";

export default function Room({ roomCode, playerNick }) {
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const roomRef = doc(db, "rooms", roomCode);
    const unsub = onSnapshot(roomRef, snap => {
      if(snap.exists()){
        const data = snap.data();
        setRoom(data);
        // find player by name (simple) - in production lepiej użyć id
        if(playerNick){
          const p = data.players?.find(pl => pl.name === playerNick);
          setPlayer(p || null);
          setIsHost(data.hostId === "HOST" && data.hostName === playerNick); // simple host check if host used same name
        }
      }
    });
    return () => unsub();
  }, [roomCode, playerNick]);

  if(!room) return <div>Ładowanie pokoju...</div>;

  const hostView = room.hostId === "HOST" && (!playerNick || playerNick === room.hostName);

  return (
    <div className="room-screen">
      <h2>Pokój {roomCode}</h2>
      <div className="room-grid">
        <div className="players-list">
          <h3>Gracze</h3>
          <ul>
            {room.players?.map(p => (
              <li key={p.id}>
                <span className="avatar">🕵️</span>
                <span>{p.name}</span>
                <span className="score">({p.score || 0})</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="main-panel">
          {hostView ? (
            <HostPanel roomCode={roomCode} room={room} />
          ) : (
            <PlayerPanel roomCode={roomCode} room={room} playerNick={playerNick} />
          )}
        </div>
      </div>
    </div>
  );
}
