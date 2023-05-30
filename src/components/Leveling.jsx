import { useEffect, useState } from "react";
import { usePlayerData, usePlayerDispatch } from "../contexts/PlayerContext";

export default function Leveling() {
  const [localPlayer, setLocalPlayer] = useState({});
  const playerData = usePlayerData();
  const playerDispatch = usePlayerDispatch();

  // Set local player state using the global player data access
  useEffect(() => {
    setLocalPlayer(playerData);
  }, [playerData]);

  // Consoling local player for developer checking
  useEffect(() => {
    console.log(localPlayer);
  }, [localPlayer]);

  // Intended to trigger a level exp increase only once.
  useEffect(() => {
    level(20)
  }, [playerData])
  

  const level = (amount) => {
    let updatedPlayerData = { ...localPlayer };
    updatedPlayerData.levelExp += amount;
    playerDispatch({ type: "update", data: updatedPlayerData });
  };

  return(
    <div></div>
  );
}