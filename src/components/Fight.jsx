import { useEffect, useState } from "react";
import { useNpcData, usePlayerData } from "../contexts/PlayerContext";

export default function Fight() {

    const [localPlayer, setLocalPlayer] = useState({})
    const [localNpc, setLocalNpc] = useState({})

    const playerData = usePlayerData()
    const npcData = useNpcData()

    useEffect(() => {
        setLocalPlayer(playerData)
    }, [playerData])

    useEffect(() => {
        console.log(localPlayer); // Check the updated localPlayer state
      }, [localPlayer]);

    useEffect(() => {
        setLocalNpc(npcData)
    }, [npcData])

    useEffect(() => {
        console.log(localNpc)
    }, [localNpc])


    return(
        <div>
            <h1>Fight</h1>
            {localPlayer &&
                <div>
                    <p>{localPlayer.name}</p>
                    <p>{localPlayer.level}</p>
                    <p>{localNpc.name}</p>
                </div>
            }
        </div>
    )
}