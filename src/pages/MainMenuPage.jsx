import { useEffect, useState } from "react"
import Fight from "../components/Fight"
import { usePlayerData, usePlayerDispatch } from "../contexts/PlayerContext"

export default function MainMenuPage() {

    const [toggleFight, setToggleFight] = useState(false)
    const [toggle, setToggle] = useState(false)

    const playerDispatch = usePlayerDispatch();
    const playerData = usePlayerData();

    function handleToggleFight() {
        setToggleFight(!toggleFight)
    }

    function handleLeveling() {
        playerDispatch({type:"addGeneralExp", data:30})
    }

    useEffect(() => {
        setToggle(true)
        const timer = setTimeout(() => {
            setToggle(false)
        }, 2000)
        return () => clearTimeout(timer)
    }, [playerData.level])



    return(
        <div>
            <h1>Some Game</h1>
            <button onClick={handleToggleFight}>Fight!</button>
            {toggleFight && <Fight />}
            <button onClick={handleLeveling}>Increase Level Exp</button>
            {toggle && 
                <div>
                    <p>You are now level {playerData.level}</p>
                </div>
            }
        </div>
    )
}