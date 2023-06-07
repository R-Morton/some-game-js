import { usePlayerData, usePlayerDispatch } from "../contexts/PlayerContext"
import { ironWeapons } from "../components/weapons/Weapons"

export default function Inventory() {

    const playerData = usePlayerData()
    const playerDispatch = usePlayerDispatch()

    function equipSword() {
        playerDispatch({type:"equip", data: ironWeapons.longsword})
    }

    return (
        <div>
            <p>Weapon: {playerData.weapon ? playerData.weapon.name : 'empty'}</p>
            <button onClick={equipSword}>Equip longsword</button>
        </div>
    )
}