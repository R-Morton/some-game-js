import { createContext, useContext, useReducer, useEffect, useState } from "react"
import { useLocalStorage } from "react-use"

const initialPlayerData = {
        name: "Player",
        level: 1,
        maxHealth: 100,
        health: null,
        baseDamage: 10,
        inventory: [],
        isPlayer: true
    }


const initialNpcData = {}



const playerReducer = (previousState, instructions) => {
    let stateEditable = previousState

    switch (instructions.type) {
        case "setup":
            let localStorageData = instructions.data
            stateEditable = localStorageData
            
            return stateEditable
        
        case "create":
            break    

            
        case "update":
            let updatedStats = instructions.data
            stateEditable = updatedStats
            return stateEditable
        
        case "delete":
            break
        default:
            console.log("Invalid instruction")

    }
}


export const PlayerDataContext = createContext(null)
export const PlayerDispatchContext = createContext(null)
export const NpcDataContext = createContext(null)
export const NpcDispatchContext = createContext(null)

export function usePlayerData() {
    return useContext(PlayerDataContext)
}

export function usePlayerDispatch() {
    return useContext(PlayerDispatchContext)
}

export function useNpcData() {
    return useContext(NpcDataContext)
}

export function useNpcDispatch() {
    return useContext(NpcDispatchContext)
}

export default function PlayerProvider(props) {


    const [playerData, playerDispatch] = useReducer(playerReducer, initialPlayerData)
    const [npcData, npcDispatch] = useReducer(playerReducer, initialNpcData)

    const [persistantData, setPersistantData] = useLocalStorage('player', initialPlayerData)

    useEffect(() => {
        playerDispatch({type:"setup", data: persistantData})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setPersistantData(playerData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerData])


    useEffect(() => {
        for (let key in initialPlayerData) {
            initialNpcData[key] = initialPlayerData[key]
        }
        initialNpcData.name = "Npc"
        initialNpcData.maxHealth = 110
        initialNpcData.isPlayer = false
    })

    useEffect(() => {
        const updatedPlayerStats = {...playerData, health: playerData.maxHealth}
        playerDispatch({type:"update", data: updatedPlayerStats})
    }, [])

    useEffect(() => {
        const updatedNpcStats = {...npcData, health: npcData.maxHealth}
        npcDispatch({type:"update", data: updatedNpcStats})
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