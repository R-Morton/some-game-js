import { useState } from "react";
import { usePlayerData, useNpcData, useNpcDispatch, usePlayerDispatch } from "../contexts/PlayerContext";

export default function Fight() {

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


    function handlePlayerAttack() {
        // When attack button is pressed, this is triggered
        // First setting the state to allow the player attacking render to show while triggering the attack function.
        attack(npcData, playerData)
        setAttackVisible(true)

        setTimeout(() => {
            // After three seconds this function is displayed.
            handleAttackDisplay()
        }, 3000)
    }

    const handleAttackDisplay = () => {
        // Immediately the visibilty is set to false to break between attacks.
        setAttackVisible(false)
        setTimeout(() => {
            // After one second the npc attack is triggered also setting visibility to true again.
            setAttackVisible(true)
            handleNpcAttack()
        }, 1000)
    }

    function handleNpcAttack() {
        // Npc attack triggered
        attack(playerData, npcData)

        setTimeout(() => {
            // After 3 seconds, visibilty set to false again.
            setAttackVisible(false)
        }, 3000)
    }

    // function to determine if defender dodges attack
    function dodgeChance(defender) {
        // generate number between 0 and 100
        const random = Math.random() * 100
        // check if random number is within defender dodge chance
        if (random < defender.dodgeChance) {
            setDodged(true)
            setTimeout(() => {
                setDodged(false)
            }, 3000)
            return true
        }
        // If number is higher than dodge chance, return false
        return false
    }

    function critChance(attacker) {
        const random = Math.random() * 100
        //check if random number is within attacker crit chance
        if (random < attacker.critChance) {
            setCrit(true)
            setTimeout(() => {
                setCrit(false)
            }, 3000)
            return true
        }
        return false
    }

    function blockChance(defender) {
        const random = Math.random() * 100
        //check if random number is within defender block chance
        if (random < defender.blockChance) {
            setBlock(true)
            setTimeout(() => {
                setBlock(false)
            }, 3000)
            return true
        }
        return false
    }
    

    function attack(defenderDispatch, attackerDispatch, type) {
        console.log(defender)
        // declaring damage of attacker as variable
        let damage = attacker.baseDamage
        let stamina = 10


        // setting local state of defender and attacker
        if (defender.isPlayer) {
            setAttacker(npcData)
            setDefender(playerData)
        } 

        // setting local state of defender and attacker
        if(attacker.isPlayer) {
            setAttacker(playerData)
            setDefender(npcData)
        }

        // if dodge chance returns false, this will be run the rest of the function, else it will be returned
        /*if (dodgeChance(defender)) {
            return 
        }*/

        if (critChance(attacker)) {
            damage *= 2
        }

        defenderDispatch({type:"receiveDamage", amount: damage})
        attackerDispatch({type:"spendStamina", amount: stamina})

    

        return
    }

    return(
        <div>
            <h1>Fight Page</h1>
            <div>
                <h3>Player Stats</h3>
                <p>{playerData.name}</p>
                <p>Health: {playerData.health}</p>
                <p>Stamina: {playerData.stamina}</p>
            </div>
            <div>
                <h3>Npc Stats</h3>
                <p>{npcData.name}</p>
                <p>Health: {npcData.health}</p>
                <p>Stamina: {npcData.stamina}</p>
            </div>
            <div>
                <button onClick={handlePlayerAttack}>Player Attack</button>

            </div>
            {attackVisible && !dodged && !crit && !block &&
                <div>
                    <p>{attacker.name} did {attacker.baseDamage} to {defender.name}</p>
                </div>
                }
                {dodged && 
                    <div>
                        <p>{defender.name} dodged due to {defender.dodgeChance}% dodge chance</p>
                    </div>
                }
            {block &&
                <div>
                    <p>{defender.name} blocked due to {defender.blockChance}% to block chance</p>
                </div>
            }
            {crit && 
                <div> 
                    <p>{attacker.name} crit hit due to their {attacker.critChance}% critical hit chance</p>
                </div>
            }
        </div>
    )
}