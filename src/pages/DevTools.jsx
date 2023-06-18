import DevArmoury from "../components/DevArmoury";
import { usePlayerData, usePlayerDispatch } from "../contexts/PlayerContext";
import { useState } from "react"

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

    return (
        <div>
            <button onClick={handleDevArmouryDisplay}>Dev Armoury</button>
            <button onClick={increaseArmourExp}>Add Armour Exp</button>
            {devArmouryDisplay && <DevArmoury />}
        </div>
    )
}