import { createContext, useContext, useReducer, useEffect } from "react"
import { useLocalStorage } from "react-use"

// Initial player data declared here. In time, player can choose name, but not yet.
const initialPlayerData = {
        isInitialData: true,
        name: "Player",
        level: 1,
        levelExp: 0,
        levelExpMax: 100,
        strength: 1,
        agility: 1,
        luck: 1,
        endurance: 1,
        maxHealth: null,
        health: null,
        maxStam: null,
        stamina: null,
        damage: null,
        dodgeChance: null,
        blockChance: null,
        critChance: null,
        baseDamage: 10,
        inventory: [],
        isPlayer: true
    }


const initialNpcData = {...initialPlayerData, name: "NPC", maxHealth: 110, isPlayer: false}


// Reducer for player and npc for updating stats.
const playerReducer = (previousState, instructions) => {
    let stateEditable = {...previousState}

    switch (instructions.type) {
        // Sets up local storage saving
        case "setup":
            let localStorageData = instructions.data
            stateEditable = localStorageData
            
            return stateEditable
        
        case "create":
            break    

            
        case "update":
            // Updated stats passed in and set into global state.
            let updatedStats = instructions.data
            stateEditable = updatedStats
            return stateEditable
        
        case "addGeneralExp":
            let tempStats = stateEditable
            tempStats.levelExp += instructions.data

            if (tempStats.levelExp >= tempStats.levelExpMax){
                tempStats.level += 1
                tempStats.levelExp = 0 + (tempStats.levelExp - tempStats.levelExpMax)
            }

            stateEditable = tempStats
            console.log(stateEditable)
            return stateEditable
        case "delete":
            break
        default:
            console.log("Invalid instruction")

    }
}

// Contexts created here
export const PlayerDataContext = createContext(null)
export const PlayerDispatchContext = createContext(null)
export const NpcDataContext = createContext(null)
export const NpcDispatchContext = createContext(null)

// Custom hook for reading player data
export function usePlayerData() {
    return useContext(PlayerDataContext)
}

// Custom hook for writing player data
export function usePlayerDispatch() {
    return useContext(PlayerDispatchContext)
}

// Custom hook for reading npc data
export function useNpcData() {
    return useContext(NpcDataContext)
}

// Customer hook for writing npc data
export function useNpcDispatch() {
    return useContext(NpcDispatchContext)
}

export default function PlayerProvider(props) {

    const [persistantData, setPersistantData] = useLocalStorage('player', initialPlayerData)

    // Initialising reducers
    const [playerData, playerDispatch] = useReducer(playerReducer, persistantData || initialPlayerData)
    const [npcData, npcDispatch] = useReducer(playerReducer, initialNpcData)


    useEffect(() => {
        playerDispatch({type:"setup", data: persistantData})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setPersistantData(playerData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerData])



    // Currently updates the health stat to match the max health
    useEffect(() => {
        const updatedPlayerStats = {...playerData}
            updatedPlayerStats.maxHealth = 100 + (updatedPlayerStats.endurance * 10)
            updatedPlayerStats.health = updatedPlayerStats.maxHealth
            updatedPlayerStats.maxStam = 100 + (updatedPlayerStats.agility * 5)
            updatedPlayerStats.stamina = updatedPlayerStats.maxStam
            updatedPlayerStats.damage = 5 + (updatedPlayerStats.strength)
            updatedPlayerStats.critChance = 5 + (updatedPlayerStats.luck * 2)
            updatedPlayerStats.blockChance = 5 + (updatedPlayerStats.endurance * 3)
            updatedPlayerStats.dodgeChance = 5 + (updatedPlayerStats.agility * 3)
        playerDispatch({type:"update", data: updatedPlayerStats})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // Does the same as above but for the npc data
    // Lets make this more DRY down the track
    useEffect(() => {
        const updatedNpcStats = {...npcData}
        updatedNpcStats.maxHealth = 100 + (updatedNpcStats.endurance * 10)
        updatedNpcStats.health = updatedNpcStats.maxHealth
        updatedNpcStats.maxStam = 100 + (updatedNpcStats.agility * 5)
        updatedNpcStats.stamina = updatedNpcStats.maxStam
        updatedNpcStats.damage = 5 + (updatedNpcStats.strength)
        updatedNpcStats.critChance = 5 + (updatedNpcStats.luck * 2)
        updatedNpcStats.blockChance = 5 + (updatedNpcStats.endurance * 3)
        updatedNpcStats.dodgeChance = 5 + (updatedNpcStats.agility * 3)
        npcDispatch({type:"update", data: updatedNpcStats})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return(
        <NpcDataContext.Provider value={npcData}>
            <NpcDispatchContext.Provider value={npcDispatch}>
                <PlayerDataContext.Provider value={playerData}>
                    <PlayerDispatchContext.Provider value={playerDispatch}>
                        {props.children}
                    </PlayerDispatchContext.Provider>
                </PlayerDataContext.Provider>
            </NpcDispatchContext.Provider>
        </NpcDataContext.Provider>
    )
}