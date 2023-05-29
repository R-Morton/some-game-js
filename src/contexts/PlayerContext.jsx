import { createContext, useContext, useReducer, useEffect } from "react"
import { useLocalStorage } from "react-use"

const initialPlayerData = [
    {
        id: 1,
        name: "",
        level: 1,
        inventory: []
    }
]

const playerReducer = (previousState, instructions) => {
    let stateEditable = [...previousState]

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

// Custom hook for read only data
export function usePlayerContext() {
    return useContext(PlayerDataContext)
}

// Custom hook for write/dispatch data
export function usePlayerDispatch() {
    return useContext(PlayerDispatchContext)
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

    return(
        <PlayerDataContext.Provider value={playerData}>
            <PlayerDispatchContext.Provider value={playerDispatch}>
                {props.children}
            </PlayerDispatchContext.Provider>
        </PlayerDataContext.Provider>
    )
}