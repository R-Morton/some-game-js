import { usePlayerData, usePlayerDispatch } from "../contexts/PlayerContext";
import { heavyArmourSets } from "../data/armour/HeavyArmour";
import { lightArmourSets } from "../data/armour/LightArmour";
import { useState, useEffect } from "react";
import { ironWeapons, reinforcedIronWeapons } from "../data/weapons/Weapons";

export default function DevArmoury() {

    const playerDispatch = usePlayerDispatch()
    const playerData = usePlayerData()

    const armour = {
        iron: Object.values(heavyArmourSets[0]),
        steel: Object.values(heavyArmourSets[1]),
        leather: Object.values(lightArmourSets[0]),
        sLeather: Object.values(lightArmourSets[1])
    }

    const weapons = {
        iron: Object.values(ironWeapons[0]),
        reIron: Object.values(reinforcedIronWeapons[0])
    }

    const [selectedPiece, setSelectedPiece] = useState()

    const handleSelect = (event, type) => {
        const selectedArmourPiece = type.find((piece) => 
            piece.name === event.target.value
        )
        setSelectedPiece(selectedArmourPiece)
    }

    function equip() {
        const isPieceInArmour = Object.values(armour).some((armourSet) =>
          armourSet.some((piece) => piece.name === selectedPiece?.name)
        );
      
        if (isPieceInArmour) {
            playerDispatch({type:"equipArmour", data: selectedPiece})
        } else {
            playerDispatch({type:"equipWeapon", data: selectedPiece})
        }
      }

    function MapArmour(type) {
        return(
        type.map((armour) => {
            return (
                <option>{armour.name}</option>
            )
        })
        )
    }

    useEffect(() => {
        const updatedPlayerStats = {...playerData}
        updatedPlayerStats.damage = 5 + (updatedPlayerStats.strength)
        updatedPlayerStats.armourRating = 0
        Object.values(playerData.armour).forEach((piece) => {
            if (piece != null) {
                updatedPlayerStats.armourRating += piece.rating
            }
        })
        playerDispatch({type:"update", data: updatedPlayerStats})

    }, [playerData.armour.head, playerData.armour.chest, playerData.armour.legs, playerData.armour.hands, playerData.armour.feet, playerData.weapon.mainHand, , playerData.weapon.offHand])
    

    return(
        <div>
            <h1>Dev Armoury</h1>
            <div className="dev-armour">
                <h3>Iron Armour</h3>
                <select onChange={(event) => handleSelect(event, armour.iron)}>
                    {MapArmour(armour.iron)}
                </select>
                <button onClick={equip}>Equip</button>
            </div>

            <div className="dev-armour">
                <h3>Steel Armour</h3>
                <select onChange={(event) => handleSelect(event, armour.steel)}>
                    {MapArmour(armour.steel)}
                </select>
                <button onClick={equip}>Equip</button>
            </div>

            <div className="dev-armour">
                <h3>Leather Armour</h3>
                <select onChange={(event) => handleSelect(event, armour.leather)}>
                    {MapArmour(armour.leather)}
                </select>
                <button onClick={equip}>Equip</button>
            </div>

            <div className="dev-armour">
                <h3>Sturdy Leather Armour</h3>
                <select onChange={(event) => handleSelect(event, armour.sLeather)}>
                    {MapArmour(armour.sLeather)}
                </select>
                <button onClick={equip}>Equip</button>
            </div>

            <div className="dev-armour">
                <h3>Iron Weapons</h3>
                <select onChange={(event) => handleSelect(event, weapons.iron)}>
                    {MapArmour(weapons.iron)}
                </select>
                <button onClick={equip}>Equip</button>
            </div>

            <div className="dev-armour">
                <h3>Reinforced Iron Weapons</h3>
                <select onChange={(event) => handleSelect(event, weapons.reIron)}>
                    {MapArmour(weapons.reIron)}
                </select>
                <button onClick={equip}>Equip</button>
            </div>





        </div>
    )
}