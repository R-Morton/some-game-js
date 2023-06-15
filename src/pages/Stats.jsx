import { usePlayerData } from "../contexts/PlayerContext";


export default function Stats() {
    const playerData = usePlayerData()
    
    return (
        <div>
            <div>
                <h3>Stats</h3>
                <p>Name: {playerData.name}</p>
                <p>Level: {playerData.level}</p>
                <p>Level Exp: {playerData.levelExp}/{playerData.levelExpMax}</p>
            </div>
            <div>
                <h4>Base Stats</h4>
                <p>Health: {playerData.maxHealth}</p>
                <p>Stamina: {playerData.maxStam}</p>
                <p>Damage: {playerData.damage}</p>
                <p>Armour: {playerData.armourRating} </p>
            </div>
            <div>
                <h4>Attributes</h4>
                <p>Strength: {playerData.strength}</p>
                <p>Endurance: {playerData.endurance}</p>
                <p>Agility: {playerData.agility}</p>
                <p>Luck: {playerData.luck}</p>
            </div>
            <div>
                <h4>Chances</h4>
                <p>Dodge Chance: {playerData.dodgeChance}%</p>
                <p>Block Chance: {playerData.blockChance}%</p>
                <p>Crit Chance: {playerData.critChance}%</p>
            </div>

        </div>
    )
}