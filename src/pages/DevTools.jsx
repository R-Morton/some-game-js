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

    function handleBladeIncrease() {
        playerDispatch({type:"addWeaponSkill"})
    }
    
    return (
        <div>
            <button onClick={handleDevArmouryDisplay}>Dev Armoury</button>
            <button onClick={handleBladeIncrease}>Increase Blade Exp</button>
            {devArmouryDisplay && <DevArmoury />}
        </div>
    )
}