import DevArmoury from "../components/DevArmoury";
import { usePlayerData, usePlayerDispatch } from "../contexts/PlayerContext";
import { useState, useEffect } from "react"

export default function DevTools() {
    const playerData = usePlayerData()
    const playerDispatch = usePlayerDispatch()

    const [devArmouryDisplay, setDevArmouryDisplay] = useState(false)


    function handleDevArmouryDisplay() {
        setDevArmouryDisplay(!devArmouryDisplay)
    }

    function increaseArmourExp() {
        playerDispatch({type: "addArmourExp"})
    }

    useEffect(() => {
        let leftOverExp = 0
        if (playerData.heavy.exp >= playerData.heavy.maxExp) {
            leftOverExp = playerData.heavy.exp - playerData.heavy.maxExp
            playerDispatch({type:"increaseArmourLevel", skill: "heavy", extra: leftOverExp})
        } else if (playerData.light.exp >= playerData.light.maxExp) {
            leftOverExp = playerData.light.exp - playerData.light.maxExp
            playerDispatch({type:"increaseArmourLevel", skill: "light", extra: leftOverExp})
        }
    }, [playerData.heavy.exp, playerData.light.exp])

    return (
        <div>
            <button onClick={handleDevArmouryDisplay}>Dev Armoury</button>
            <button onClick={increaseArmourExp}>Add Armour Exp</button>
            {devArmouryDisplay && <DevArmoury />}
        </div>
    )
}