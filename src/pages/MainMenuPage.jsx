import { useState } from "react"
import Fight from "../components/Fight"

export default function MainMenuPage() {

    const [toggleFight, setToggleFight] = useState(false)

    function handleToggleFight() {
        setToggleFight(!toggleFight)
    }

    return(
        <div>
            <h1>Some Game</h1>
            <button onClick={handleToggleFight}>Fight!</button>
            {toggleFight && <Fight />}
        </div>
    )
}