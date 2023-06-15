import { usePlayerData, usePlayerDispatch } from "../contexts/PlayerContext";
import { armourSets } from "../data/armour/Armour";
import { useState, useEffect } from "react";

export default function DevArmoury() {

    const playerDispatch = usePlayerDispatch()
    const playerData = usePlayerData()

    const ironArmour = Object.values(armourSets[0])
    const steelArmour = Object.values(armourSets[1])

    const allArmorPieces = armourSets
    .map((armorSet) => Object.values(armorSet))
    .flat();

    const [selectedPiece, setSelectedPiece] = useState()

    const handleSelectArmourPiece = (event) => {
        const selectedArmourPiece = ironArmour.find((piece) => 
            piece.name === event.target.value
        )
        setSelectedPiece(selectedArmourPiece)
    }

    function equip() {
        playerDispatch({type:"equipArmour", data: selectedPiece})
        console.log(steelArmour)
    }

    useEffect(() => {
        console.log("this runs")
        const updatedPlayerStats = {...playerData}
        updatedPlayerStats.armourRating = 0
        Object.values(playerData.armour).forEach((piece) => {
            if (piece != null) {
                updatedPlayerStats.armourRating += piece.rating
            }
        })
        playerDispatch({type:"update", data: updatedPlayerStats})

    }, [playerData.armour])
    

    return(
        <div>
            <h1>Dev Armoury</h1>
            <div className="dev-armour">
                <h3>Iron Armour</h3>
                <select onChange={handleSelectArmourPiece}>
                    {ironArmour.map((armour) => {
                        return (
                            <option>{armour.name}</option>
                        )
                    })}
                </select>
                <button onClick={equip}>Equip</button>
            </div>

            <div className="dev-armour">
                <h3>Steel Armour</h3>
                <select onChange={handleSelectArmourPiece}>
                    {steelArmour.map((armour) => {
                        return (
                            <option>{armour.name}</option>
                        )
                    })}
                </select>
                <button>Equip</button>
            </div>
        </div>
    )
}