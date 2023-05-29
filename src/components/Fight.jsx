import { useContext, useEffect, useState } from "react";
import { usePlayerData, NpcDataContext, useNpcData, NpcDispatchContext, useNpcDispatch, usePlayerDispatch } from "../contexts/PlayerContext";

export default function Fight() {

    
    const [localPlayer, setLocalPlayer] = useState({})
    const [localNpc, setLocalNpc] = useState({})
    const [toggleAttack, setToggleAttack] = useState(false)

    const playerData = usePlayerData()
    const playerDispatch = usePlayerDispatch()
    const npcDispatch = useNpcDispatch()
    const npcData = useNpcData()

    useEffect(() => {
        setLocalPlayer(playerData)
    }, [playerData])

    useEffect(() => {
        console.log(localPlayer);
      }, [localPlayer]);

    useEffect(() => {
        setLocalNpc(npcData)
    }, [npcData])

    useEffect(() => {
        console.log(localNpc)
    }, [localNpc])

    function handleToggleAttack() {
        setToggleAttack(!toggleAttack)
    }

    function handlePlayerAttack() {
        attack(localNpc, localPlayer)
    }

    function handleNpcAttack() {
        attack(localPlayer, localNpc)
    }

    function attack(defender, attacker) {
        let defenderDamageTaken = attacker.baseDamage

        let defenderStats = {...defender}
        defenderStats.health -= defenderDamageTaken
        if (defender.isPlayer) {
            playerDispatch({type:"update", data: defenderStats})

        } else {
            npcDispatch({type:"update", data: defenderStats})
        }
        
    }

    return(
        <div>
            <h1>Fight Page</h1>
            <div>
                <h3>Player Stats</h3>
                <p>{localPlayer.name}</p>
                <p>{localPlayer.health}</p>
            </div>
            <div>
                <h3>Npc Stats</h3>
                <p>{localNpc.name}</p>
                <p>{localNpc.health}</p>
            </div>
            <div>
                <button onClick={handleNpcAttack}>Npc Attack</button>
                <button onClick={handlePlayerAttack}>Player Attack</button>

            </div>
        </div>
    )
}