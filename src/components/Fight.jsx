import { useEffect, useState } from "react";
import { usePlayerData, useNpcData, useNpcDispatch, usePlayerDispatch } from "../contexts/PlayerContext";

export default function Fight(props) {

    const [attackVisible, setAttackVisible] = useState(false)
    const [attacker, setAttacker] = useState()
    const [defender, setDefender] = useState()

    const [playerAttack, setPlayerAttack] = useState(false)

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



    useEffect(() => {
        if (playerData.stamina > playerData.maxStam) {
            playerDispatch({type:"modifyStamina", amount: playerData.stamina - playerData.maxStam, modifier: "minus"})
        }
    // eslint-disable-next-line
    }, [playerData.stamina])

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

    function exitFight() {
        setPlayerDead(false)
        setNpcDead(false)
        npcDispatch({type:"resetStats"})
        playerDispatch({type:"resetStats"})
        props.toggleFight()
    }

    function handlePlayerAttack(type) {
        // When attack button is pressed, this is triggered
        // First setting the state to allow the player attacking render to show while triggering the attack function.
        
        if (playerData.stamina < 10 && (!type === 'hStance' || !type === 'nStance')) {
            setNoStam(true)
            setTimeout(() => {
                setNoStam(false)
            }, 3000)
            return
        }

        if (type === 'nStance') {
            setStance('normal stance')
            setTimeout(() => {
                setStance(false)
                playerDispatch({type:"modifyStamina", amount: 30, modifier: "plus"})
                handleNpcAttack("normal")
            }, 3000)
        } else if (type === 'hStance') {
            setStance('heavy stance')
            setTimeout(() => {
                setStance(false)
                playerDispatch({type:"modifyStamina", amount: 15, modifier: "plus"})
                handleNpcAttack("heavy")
            }, 3000)
        } else {
            attack(npcDispatch, npcData, playerDispatch, playerData, type)
            setAttackVisible(true)
    
            setTimeout(() => {
                // After three seconds this function is displayed.
                setPlayerAttack(true)
            }, 3000)
        }
    }

    useEffect(() => {
        if(playerAttack && npcData.health > 0) {
            handleNpcAttack()
        }
    // eslint-disable-next-line
    }, [playerAttack, npcData.health])

    function handleNpcAttack(stance) {
        // Npc attack triggered
        setPlayerAttack(false)
        setAttackVisible(false)

        console.log(npcDead)

        setTimeout(() => {
            setAttackVisible(true)
            attack(playerDispatch, playerData, npcDispatch, npcData, "light", stance)

            setTimeout(() => {
                if (stance === 'heavy') {
                }
                setAttackVisible(false)
            }, 3000)

        }, 1000)
    }

    // function to determine if defender dodges attack
    function dodgeChance(defender, stance) {
        // generate number between 0 and 100
        const random = Math.random() * 100
        let dodgeChance = defender.dodgeChance
        if (stance === 'normal') {
            // eslint-disable-next-line
            dodgeChance += 10
        }
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

    function blockChance(defender, stance) {
        const random = Math.random() * 100
        let blockChance = defender.blockChance
        if (stance === 'heavy') {
            blockChance =+ 30
        }
        //check if random number is within defender block chance
        if (random < blockChance) {
            setBlock(true)
            setTimeout(() => {
                setBlock(false)
            }, 3000)
            return true
        }
        return false
    }
    

    function attack(defenderDispatch, defenderData, attackerDispatch, attackerData, type, stance) {
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
        if (dodgeChance(defenderData, stance)) {
            attackerDispatch({type:"modifyStamina", amount: stamina, modifier: "minus"})
            return 
        }

        if (blockChance(defenderData, stance)) {
            attackerDispatch({type:"modifyStamina", amount: stamina, modifier: "minus"})
            return
        }



        if (critChance(attackerData)) {
            damage *= 2
        }

        setAttackerDamageDealt(damage)


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