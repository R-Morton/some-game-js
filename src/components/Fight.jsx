import { useEffect, useState } from "react";
import { usePlayerData, useNpcData, useNpcDispatch, usePlayerDispatch } from "../contexts/PlayerContext";

export default function Fight(props) {

    const [attackVisible, setAttackVisible] = useState(false)
    const [attacker, setAttacker] = useState()
    const [defender, setDefender] = useState()

    const [playerAttack, setPlayerAttack] = useState(false)
    const [playerStance, setPlayerStance] = useState(false)

    const playerData = usePlayerData()
    const playerDispatch = usePlayerDispatch()
    const npcDispatch = useNpcDispatch()
    const npcData = useNpcData()

    const [dodged, setDodged] = useState(false)
    const [crit, setCrit] = useState(false)
    const [block, setBlock] = useState(false)
    const [stance, setStance] = useState(false)
    const [noStam, setNoStam] = useState(false)

    const [playerDead, setPlayerDead] = useState(false)
    const [npcDead, setNpcDead] = useState(false)

    const [attackerDamageDealt, setAttackerDamageDealt] = useState()


    // Modifies the stamina value to ensure it does not go above max
    useEffect(() => {
        if (playerData.stamina > playerData.maxStam) {
            playerDispatch({type:"modifyStamina", amount: playerData.stamina - playerData.maxStam, modifier: "minus"})
        }
    // eslint-disable-next-line
    }, [playerData.stamina])

    // Checks player and npc health and modifies to not display negative numbers
    useEffect(() => {
        if (playerData.health <= 0) {
            playerDispatch({type:"modifyHealth", modifier: 'plus', amount: Math.abs(playerData.health - 0)})
            setPlayerDead(true)
        }

        if (npcData.health <= 0) {
            npcDispatch({type:"modifyHealth", modifier: 'plus', amount: Math.abs(npcData.health - 0)})
            setNpcDead(true)
        }
    // eslint-disable-next-line
    }, [playerData.health, npcData.health])

    // Function to exit the fight component and resets all stats and state needed.
    function exitFight() {
        setPlayerDead(false)
        setNpcDead(false)
        npcDispatch({type:"resetStats"})
        playerDispatch({type:"resetStats"})
        props.toggleFight()
    }

    // When attack button is pressed, this is triggered
    function handlePlayerAttack(type) {
        console.log(npcData)
        // Checking if an attack is being made, not a stance and if stamina is below 10. If true, then trigger a no stamina display and return.
        if (playerData.stamina < 10 && (!type === 'hStance' || !type === 'nStance')) {
            setNoStam(true)
            setTimeout(() => {
                setNoStam(false)
            }, 3000)
            return
        }

        // If normal stance was selected, then modify stamina and go straight to npc attack
        if (type === 'nStance') {
            setStance('normal stance')
            setTimeout(() => {
                setStance(false)
                playerDispatch({type:"modifyStamina", amount: 30, modifier: "plus"})
                // set stance state to normal
                setPlayerStance("normal")
            }, 3000)
        
        // If heavy stance, same process as normal stance but different stat changes
        } else if (type === 'hStance') {
            setStance('heavy stance')
            setTimeout(() => {
                setStance(false)
                playerDispatch({type:"modifyStamina", amount: 15, modifier: "plus"})
                // set stance state to heavy
                setPlayerStance("heavy")
            }, 3000)
        } else {
            
            // No stance selected, proceed with attack
            attack(npcDispatch, npcData, playerDispatch, playerData, type)
            setAttackVisible(true)
    
            setTimeout(() => {
                // Setting attack state to true
                setPlayerAttack(true)
            }, 3000)
        }
    }

    useEffect(() => {
        // If playerattack state is true and npc health is above 0, this will trigger, calling the npc to attack
        if(playerAttack && npcData.health > 0) {
            handleNpcAttack()
        }
    // eslint-disable-next-line
    }, [playerAttack, npcData.health])

    useEffect(() => {
        // If player stance state is set to a value and npc health is above 0, this will trigger, calling the npc to attack
        if (playerStance && npcData.health > 0) {
            handleNpcAttack(playerStance)
        }
    // eslint-disable-next-line
    }, [playerStance, npcData.health])

    function handleNpcAttack() {
        // Resetting player attack back to false now that the npc attack is about to be triggered
        setPlayerAttack(false)
        setAttackVisible(false)

        setTimeout(() => {
            // After 3 seconds, the npc attack is triggered, passing the playerStance state as a variable
            setAttackVisible(true)
            attack(playerDispatch, playerData, npcDispatch, npcData, "light", playerStance)

            setTimeout(() => {
                setAttackVisible(false)
            }, 3000)

        }, 1000)
    }

    // function to determine if defender dodges attack
    function dodgeChance(defender, stance) {
        // generate number between 0 and 100
        const random = Math.random() * 100
        let dodgeChance = defender.dodgeChance
        // Checking stance value passed into the attack function and increasing dodge chance if true
        if (stance === 'normal') {
            // eslint-disable-next-line
            dodgeChance += 10
        }
        // check if random number is within defender dodge chance and return true if truthy
        if (random < dodgeChance) {
            setPlayerStance(false)
            setDodged(true)
            setTimeout(() => {
                setDodged(false)
            }, 3000)
            return true
        }
        // If number is higher than dodge chance, return false
        setPlayerStance(false)
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

    function blockChance(defender, stance) {
        const random = Math.random() * 100
        let blockChance = defender.blockChance
        // Similar with dodge chance function. Check if stance passed through is heavy and increase block chance if true
        if (stance === 'heavy') {
            blockChance =+ 30
        }
        //check if random number is within defender block chance
        if (random < blockChance) {
            setPlayerStance(false)
            setBlock(true)
            setTimeout(() => {
                setBlock(false)
            }, 3000)
            return true
        }
        setPlayerStance(false)
        return false
    }
    

    function attack(defenderDispatch, defenderData, attackerDispatch, attackerData, type, stance) {
        // declaring damage of attacker as variable and base cost of stamina to attacker
        let damage = attackerData.baseDamage
        let stamina = 10

        // setting local state of defender and attacker for rendering display
        setAttacker(attackerData)
        setDefender(defenderData)

        // If type of attack is heavy, increase damage and stamina values
        if (type === 'heavy') {
            damage *= 1.5
            stamina *= 2
        }


        // if dodge chance returns false, this will be run the rest of the function, else it will be returned
        if (dodgeChance(defenderData, stance)) {
            attackerDispatch({type:"modifyStamina", amount: stamina, modifier: "minus"})
            return 
        }

        // If block chance returns false, then continue function
        if (blockChance(defenderData, stance)) {
            attackerDispatch({type:"modifyStamina", amount: stamina, modifier: "minus"})
            return
        }

        // If critChance returns true, then double the damage
        if (critChance(attackerData)) {
            damage *= 2
        }

        // Setting final damage dealt to state for displaying in render
        setAttackerDamageDealt(damage)

        // Use dispatches to modify health and stamina of attacker and defender
        defenderDispatch({type:"modifyHealth", modifier:"minus", amount: damage})
        attackerDispatch({type:"modifyStamina", amount: stamina, modifier: 'minus'})

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
                {(!playerDead && !npcDead) && 
                    <div>
                        <button onClick={() => handlePlayerAttack("light")}>Light Attack</button>
                        <button onClick={() => handlePlayerAttack("heavy")}>Heavy Attack</button>
                        <button onClick={() => handlePlayerAttack("nStance")}>Normal Stance</button>
                        <button onClick={() => handlePlayerAttack("hStance")}>Heavy Stance</button>
                    </div>}
                {(playerDead || npcDead) && <button onClick={exitFight}>Exit fight</button>}

            </div>
            {attackVisible && !dodged && !crit && !block && !stance && !noStam && !playerDead && !npcDead &&
                <div>
                    <p>{attacker.name} did {attackerDamageDealt} to {defender.name}</p>
                </div>
                }
                {dodged && 
                    <div>
                        <p>{defender.name} dodged!</p>
                    </div>
                }
            {block &&
                <div>
                    <p>{defender.name} blocked!</p>
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
            {noStam && 
                <div>
                    <p>You have no stamina</p>
                </div>
            }

            {playerDead &&
                <div>
                    <p>You died!</p>
                </div>
            }

            {npcDead &&
                <div>
                    <p>You killed {npcData.name}</p>
                </div>
            }
        </div>
    )
}