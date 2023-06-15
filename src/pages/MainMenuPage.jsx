import { useState } from "react"
import Fight from "../components/Fight"
import Inventory from "./Inventory"
import Stats from "./Stats"
import DevTools from "./DevTools"

export default function MainMenuPage() {

    const [toggleFight, setToggleFight] = useState(false)
    const [toggleInventory, setToggleInventory] = useState(false)
    const [toggleStats, setToggleStats] = useState(false)
    const [toggleDevTools, setToggleDevTools] = useState(false)

    function handleToggleFight() {
        setToggleFight(!toggleFight)
    }

    function handleInventory() {
        setToggleInventory(!toggleInventory)
    }

    function handleToggleStats() {
        setToggleStats(!toggleStats)
    }

    function handleToggleDevTools() {
        setToggleDevTools(!toggleDevTools)
    }



    return(
        <div>
            {!toggleFight &&
                <div>
                    <h1>Some Game</h1>
                    <button onClick={handleToggleFight}>Fight!</button>
                    <button onClick={handleInventory}>Inventory</button>
                    <button onClick={handleToggleStats}>Stats</button>
                    <button onClick={handleToggleDevTools}>Dev Tools</button>
                </div>
            }
            {toggleFight && <Fight toggleFight={handleToggleFight}/>}
            {toggleInventory && <Inventory />}
            {toggleStats && <Stats />}
            {toggleDevTools && <DevTools />}
        </div>
    )
}