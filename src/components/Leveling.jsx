import { useEffect } from "react";
import { usePlayerData, usePlayerDispatch } from "../contexts/PlayerContext";

export default function Leveling(props) {

  const playerData = usePlayerData();
  const playerDispatch = usePlayerDispatch();

  useEffect(() => {

    const level = (amount) => {
      let updatedPlayerData = { ...playerData };
      updatedPlayerData.levelExp += amount;
      console.log(updatedPlayerData)
      playerDispatch({ type: "update", data: updatedPlayerData });
      props.toggleLeveling()
    }

    level(props.amount)
    
  }, [playerData, playerDispatch, props])
  

  return(
    <div></div>
  );
}