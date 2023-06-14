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
    const [stance, setStance] = useState(false)

    const [attackerDamageDealt, setAttackerDamageDealt] = useState()


    function handlePlayerAttack(type) {
        // When attack button is pressed, this is triggered
        // First setting the state to allow the player attacking render to show while triggering the attack function.
        if (type === 'nStance') {
            setStance('normal stance')
            setTimeout(() => {
                setStance(false)
                handleNpcAttack()
            }, 3000)
        } else if (type === 'hStance') {
            setStance('heavy stance')
            playerDispatch({type:"modifyBlock", modifier:"plus"})
            setTimeout(() => {
                setStance(false)
                console.log(playerData.blockChance)
                handleNpcAttack("heavy")
            }, 3000)
        } else {
            attack(npcDispatch, npcData, playerDispatch, playerData, type)
            setAttackVisible(true)
    
            setTimeout(() => {
                // After three seconds this function is displayed.
                handleNpcAttack()
            }, 3000)
        }
    }

    function handleNpcAttack(stance) {
        // Npc attack triggered
        setAttackVisible(false)
        setTimeout(() => {
            setAttackVisible(true)
            attack(playerDispatch, playerData, npcDispatch, npcData, "light")

            setTimeout(() => {
                if (stance === 'heavy') {
                    playerDispatch({type:"modifyBlock", modifier:"minus"})
                }
                setAttackVisible(false)
            }, 3000)

        }, 1000)
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
        console.log(`${random}/${defender.blockChance}`)
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
    

    function attack(defenderDispatch, defenderData, attackerDispatch, attackerData, type) {
        // declaring damage of attacker as variable
        let damage = attackerData.baseDamage
        let stamina = 10


        // setting local state of defender and attacker
        setAttacker(attackerData)
        setDefender(defenderData)

        if (type === 'heavy') {
            damage *= 1.5
            stamina *= 2
        }


        // if dodge chance returns false, this will be run the rest of the function, else it will be returned
        if (dodgeChance(defenderData)) {
            attackerDispatch({type:"spendStamina", amount: stamina})
            return 
        }

        if (blockChance(defenderData)) {
            attackerDispatch({type:"spendStamina", amount: stamina})
            return
        }



        if (critChance(attackerData)) {
            damage *= 2
        }

        setAttackerDamageDealt(damage)


        defenderDispatch({type:"damageHealth", amount: damage})
        attackerDispatch({type:"spendStamina", amount: stamina})

    

        return
    }

    return(
        <div>
            <h1>Fight Page</h1>
            {playerData && npcData &&
            <div>
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
            </div>
            }
            <div>
                <button onClick={() => handlePlayerAttack("light")}>Light Attack</button>
                <button onClick={() => handlePlayerAttack("heavy")}>Heavy Attack</button>
                <button onClick={() => handlePlayerAttack("nStance")}>Normal Stance</button>
                <button onClick={() => handlePlayerAttack("hStance")}>Heavy Stance</button>

            </div>
            {attackVisible && !dodged && !crit && !block && !stance &&
                <div>
                    <p>{attacker.name} did {attackerDamageDealt} to {defender.name}</p>
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
            {stance &&
                <div>
                    <p>{playerData.name} uses {stance}</p>
                </div>
            }
        </div>
    )
}