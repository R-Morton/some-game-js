import { usePlayerData } from "../contexts/PlayerContext";

export default function DevTools() {
    playerData = usePlayerData()
    playerDispatch = usePlayerDispatch()
}