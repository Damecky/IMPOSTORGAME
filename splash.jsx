import React, { useEffect } from "react";

export default function Splash({ onFinish }) {
  useEffect(() => {
    const t = setTimeout(() => onFinish(), 2800); // 2.8s animacja
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <div className="splash">
      <div className="logo-wrap">
        <img src="/logo-512.png" alt="Impostor Logo" className="logo-img" />
        <div className="scan-line" />
      </div>
      <div className="splash-text">IMPOSTOR — gra detektywistyczna</div>
      <button className="skip-btn" onClick={onFinish}>Pomiń</button>
    </div>
  );
}
