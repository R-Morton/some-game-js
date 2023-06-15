import { useState } from "react"
import Fight from "../components/Fight"
import Inventory from "./Inventory"

export default function MainMenuPage() {

    const [toggleFight, setToggleFight] = useState(false)
    const [toggleInventory, setToggleInventory] = useState(false)

    function handleToggleFight() {
        setToggleFight(!toggleFight)
    }

    function handleInventory() {
        setToggleInventory(!toggleInventory)
    }



    return(
        <div>
            {!toggleFight &&
                <div>
                    <h1>Some Game</h1>
                    <button onClick={handleToggleFight}>Fight!</button>
                    <button onClick={handleInventory}>Inventory</button>
                </div>
            }
            {toggleFight && <Fight toggleFight={handleToggleFight}/>}
            {toggleInventory && <Inventory />}
        </div>
    )
}