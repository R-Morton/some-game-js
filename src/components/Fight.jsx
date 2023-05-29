import { useContext, useEffect, useState } from "react";
import { usePlayerData, NpcDataContext, useNpcData, NpcDispatchContext, useNpcDispatch, usePlayerDispatch } from "../contexts/PlayerContext";

export default function Fight() {

    
    const [localPlayer, setLocalPlayer] = useState({})
    const [localNpc, setLocalNpc] = useState({})
    const [attackVisible, setAttackVisible] = useState(false)
    const [attacker, setAttacker] = useState()
    const [defender, setDefender] = useState()

    const playerData = usePlayerData()
    const playerDispatch = usePlayerDispatch()
    const npcDispatch = useNpcDispatch()
    const npcData = useNpcData()

    // Set local player state using the global player data access
    useEffect(() => {
        setLocalPlayer(playerData)
    }, [playerData])

    // Consoling local player for developer checking
    useEffect(() => {
        console.log(localPlayer);
      }, [localPlayer]);
    
    // Similar process as above but with npc data
    useEffect(() => {
        setLocalNpc(npcData)
    }, [npcData])

    useEffect(() => {
        console.log(localNpc)
    }, [localNpc])


    function handlePlayerAttack() {
        // When attack button is pressed, this is triggered
        // First setting the state to allow the player attacking render to show while triggering the attack function.
        setAttackVisible(true)
        attack(localNpc, localPlayer)

        const timer = setTimeout(() => {
            // After three seconds this function is displayed.
            handleAttackDisplay()
        }, 3000)

        return () => clearTimeout(timer)
    }

    const handleAttackDisplay = () => {
        // Immediately the visibilty is set to false to break between attacks.
        setAttackVisible(false)
        const timer = setTimeout(() => {
            // After one second the npc attack is triggered also setting visibility to true again.
            setAttackVisible(true)
            handleNpcAttack()
        }, 1000)

        return () => clearTimeout(timer)
    }

    function handleNpcAttack() {
        // Npc attack triggered
        attack(localPlayer, localNpc)

        const timer = setTimeout(() => {
            // After 3 seconds, visibilty set to false again.
            setAttackVisible(false)
        }, 3000)

        return () => clearTimeout(timer)
    }

    function attack(defender, attacker) {
        // declaring damage of attacker as variable
        let damage = attacker.baseDamage

        // Declaring variable of defender stats
        let defenderStats = {...defender}

        // reducing defender health by attacker damage
        defenderStats.health -= damage

        // If defender is player, update state of npc and set attack/defender state
        if (defender.isPlayer) {
            playerDispatch({type:"update", data: defenderStats})
            setAttacker(localNpc)
            setDefender(localPlayer)
        
        // Else do opposite
        } else if(attacker.isPlayer) {
            npcDispatch({type:"update", data: defenderStats})
            setAttacker(localPlayer)
            setDefender(localNpc)
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
                <button onClick={handlePlayerAttack}>Player Attack</button>

            </div>
            <div>
                {attackVisible && 
                    <div>
                        <p>{attacker.name} did {attacker.baseDamage} to {defender.name}</p>
                    </div>
                }
            </div>
        </div>
    )
}