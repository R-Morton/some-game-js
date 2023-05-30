import { createContext, useContext, useReducer, useEffect } from "react"
import { useLocalStorage } from "react-use"

// Initial player data declared here. In time, player can choose name, but not yet.
const initialPlayerData = {
        name: "Player",
        level: 1,
        levelExp: 0,
        levelExpMax: 100,
        strength: 1,
        agility: 1,
        luck: 1,
        endurance: 1,
        maxHealth: 100,
        health: null,
        baseDamage: 10,
        inventory: [],
        isPlayer: true
    }


const initialNpcData = {...initialPlayerData, name: "NPC", maxHealth: 110, isPlayer: false}


// Reducer for player and npc for updating stats.
const playerReducer = (previousState, instructions) => {
    let stateEditable = previousState

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

    // Initialising reducers
    const [playerData, playerDispatch] = useReducer(playerReducer, initialPlayerData)
    const [npcData, npcDispatch] = useReducer(playerReducer, initialNpcData)

    // Persistant data saved here before being saved to Local Storage
    const [persistantData, setPersistantData] = useLocalStorage('player', initialPlayerData)

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
        const updatedPlayerStats = {...playerData, health: playerData.maxHealth}
        playerDispatch({type:"update", data: updatedPlayerStats})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // Does the same as above but for the npc data
    useEffect(() => {
        const updatedNpcStats = {...npcData, health: npcData.maxHealth}
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