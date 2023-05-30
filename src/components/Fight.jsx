import { useEffect, useState } from "react";
import { usePlayerData, useNpcData, useNpcDispatch, usePlayerDispatch } from "../contexts/PlayerContext";

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

    const [dodged, setDodged] = useState(false)
    const [crit, setCrit] = useState(false)
    const [block, setBlock] = useState(false)

    // Set local player state using the global player data access
    useEffect(() => {
        setLocalPlayer(playerData)
    }, [playerData])

    // Similar process as above but with npc data
    useEffect(() => {
        setLocalNpc(npcData)
    }, [npcData])


    function handlePlayerAttack() {
        // When attack button is pressed, this is triggered
        // First setting the state to allow the player attacking render to show while triggering the attack function.
        attack(localNpc, localPlayer)
        setAttackVisible(true)

        const timer = setTimeout(() => {
            // After three seconds this function is displayed.
            handleAttackDisplay()
        }, 3000)
    }

    const handleAttackDisplay = () => {
        // Immediately the visibilty is set to false to break between attacks.
        setAttackVisible(false)
        const timer = setTimeout(() => {
            // After one second the npc attack is triggered also setting visibility to true again.
            setAttackVisible(true)
            handleNpcAttack()
        }, 1000)
    }

    function handleNpcAttack() {
        // Npc attack triggered
        attack(localPlayer, localNpc)

        const timer = setTimeout(() => {
            // After 3 seconds, visibilty set to false again.
            setAttackVisible(false)
        }, 3000)
    }

    function dodgeChance(defender) {
        const random = Math.random() * 100
        if (random < defender.dodgeChance) {
            setDodged(true)
            setTimeout(() => {
                setDodged(false)
            }, 3000)
            return true
        }
        return false
    }

    function attack(defender, attacker) {
        console.log(defender)
        // declaring damage of attacker as variable
        let damage = attacker.baseDamage

        // Declaring variable of defender stats
        let defenderStats = {...defender}

        // reducing defender health by attacker damage
        defenderStats.health -= damage

        if (defender.isPlayer) {
            setAttacker(localNpc)
            setDefender(localPlayer)
        
        } 
        if(attacker.isPlayer) {
            setAttacker(localPlayer)
            setDefender(localNpc)
        }

        if (dodgeChance(defender)) {
            return 
        }

        // If defender is player, update state of npc and set attack/defender state
        if (defender.isPlayer) {
            playerDispatch({type:"update", data: defenderStats})
        
        // Else do opposite
        } else if(attacker.isPlayer) {
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
                <button onClick={handlePlayerAttack}>Player Attack</button>

            </div>
            <div>
                {attackVisible && !dodged &&
                    <div>
                        <p>{attacker.name} did {attacker.baseDamage} to {defender.name}</p>
                    </div>
                }
            </div>
            <div>
                {dodged && 
                    <div>
                        <p>{defender.name} dodged due to {defender.dodgeChance}% dodge chance</p>
                    </div>
                }
            </div>
        </div>
    )
}