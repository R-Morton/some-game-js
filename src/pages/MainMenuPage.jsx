import { useState } from "react"
import Fight from "../components/Fight"
import GeneralLeveling from "../components/Leveling"
import Leveling from "../components/Leveling"

export default function MainMenuPage() {

    const [toggleFight, setToggleFight] = useState(false)
    const [toggle, setToggle] = useState(false)

    function handleToggleFight() {
        setToggleFight(!toggleFight)
    }

    function handleLeveling() {
        setToggle(!toggle)
    }

    return(
        <div>
            <h1>Some Game</h1>
            <button onClick={handleToggleFight}>Fight!</button>
            {toggleFight && <Fight />}
            <button onClick={handleLeveling}>Increase Level Exp</button>
            {toggle && <Leveling />}
            
        </div>
    )
}