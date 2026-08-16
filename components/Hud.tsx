"use client";

import { useEffect, useState } from "react";

/* A small fixed readout in the corner — the kind of ambient status
   chrome that makes a page feel instrumented rather than static. */
export default function Hud() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      // Bangalore time, so the readout means something to a visitor
      // wondering whether it's a reasonable hour to reach out.
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hud" aria-hidden="true">
      <span>BLR <b>{time || "--:--"}</b></span>
      <span>status <b>available</b></span>
    </div>
  );
}
