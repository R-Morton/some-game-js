import { createContext, useContext, useReducer, useEffect } from "react"
import { useLocalStorage } from "react-use"

const initialPlayerData = {
        name: "Player",
        level: 1,
        inventory: []
    }

const initialNpcData = {}



const playerReducer = (previousState, instructions) => {
    let stateEditable = previousState

    switch (instructions.type) {
        case "setup":
            let localStorageData = instructions.data
            stateEditable = localStorageData
            
            // Whatever is returned is the new state data
            return stateEditable
        
        case "create":
            break    

            
        case "update":
            break
        
        case "delete":
            break
        default:
            console.log("Invalid instruction")

    }
}


export const PlayerDataContext = createContext(null)
export const PlayerDispatchContext = createContext(null)
export const NpcDataContext = createContext(initialNpcData)

// Custom hook for read only data
export function usePlayerData() {
    return useContext(PlayerDataContext)
}

// Custom hook for write/dispatch data
export function usePlayerDispatch() {
    return useContext(PlayerDispatchContext)
}

export function useNpcData() {
    return useContext(NpcDataContext)
}

export default function PlayerProvider(props) {

    const [playerData, playerDispatch] = useReducer(playerReducer, initialPlayerData)

    const [persistantData, setPersistantData] = useLocalStorage('player', initialPlayerData)

    useEffect(() => {
        playerDispatch({type:"setup", data: persistantData})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //Autosaves changes to noted from reducer state into localstorage
    useEffect(() => {
        setPersistantData(playerData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerData])

    useEffect(() => {
        for (let key in initialPlayerData) {
            initialNpcData[key] = initialPlayerData[key]
        }
        initialNpcData.name = "Npc"
    })

    return(
        <NpcDataContext.Provider value={initialNpcData}>
            <PlayerDataContext.Provider value={playerData}>
                <PlayerDispatchContext.Provider value={playerDispatch}>
                    {props.children}
                </PlayerDispatchContext.Provider>
            </PlayerDataContext.Provider>
        </NpcDataContext.Provider>
    )
}