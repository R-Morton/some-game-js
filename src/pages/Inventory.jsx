import { usePlayerData, usePlayerDispatch } from "../contexts/PlayerContext"
import { ironWeapons } from "../components/weapons/Weapons"
import { ironArmour } from "../components/armour/Armour"

export default function Inventory() {

    const playerData = usePlayerData()
    const playerDispatch = usePlayerDispatch()

    function equipSword() {
        playerDispatch({type:"equip", data: ironWeapons.longsword})
    }

    function equipArmor() {
        playerDispatch({type:"equipArmour", data: ironArmour.chest})
    }

    return (
        <div>
            <h4>Weapons</h4>
            <p>Main Hand: {playerData.weapon.mainHand ? playerData.weapon.mainHand.name : 'empty'}</p>
            <p>Off Hand: {playerData.weapon.offHand ? playerData.weapon.offHand.name : 'empty'}</p>

            <h4>Armour</h4>
            <p>Head: {playerData.armour.head ? playerData.armour.head.name : 'empty'}</p>
            <p>Chest: {playerData.armour.chest ? playerData.armour.chest.name : 'empty'}</p>
            <p>Legs: {playerData.armour.legs ? playerData.armour.legs.name : 'empty'}</p>
            <p>Hands: {playerData.armour.hands ? playerData.armour.hands.name : 'empty'}</p>
            <p>Feet: {playerData.armour.feet ? playerData.armour.feet.name : 'empty'}</p>
            
            <button onClick={equipSword}>Equip longsword</button>
            <button onClick={equipArmor}>Equip Helmet</button>
        </div>
    )
}