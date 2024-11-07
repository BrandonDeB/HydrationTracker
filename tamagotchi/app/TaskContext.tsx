import { createContext, useContext } from "react"
import * as SQLite from "expo-sqlite";

async function setUser() {
    const db = await SQLite.openDatabaseAsync('hydration.db');
    const user: {name: string, height: number, weight: number, gender: string, coins: number} | null = await db.getFirstAsync('SELECT * FROM user');
    if (user == null) {
        console.log("User is null")
        return null;
    } else {
        return user;
    }
}

function setLastRecord() {

}

function setBottles() {

}

export type GlobalContent = {
    bottles: number[]
    setBottles:(c: number[]) => void
    lastRecord: {time: number, hydrationLevel: number}
    setLastRecord:(c: number) => void
    user: {name: string, height: number, weight: number, gender: string, coins: number}
    setUser:(c: number) => void
}
export const MyGlobalContext = createContext<GlobalContent>({
    bottles: [],
    setBottles: () => setBottles(),
    lastRecord: {time: 10, hydrationLevel: 100},
    setLastRecord: () => setLastRecord(),
    user: {name: "Noname", height: 10, weight: 100, gender: "M", coins: 0},
    setUser:() => {}
})
export const useGlobalContext = () => useContext(MyGlobalContext)
