import * as SQLite from 'expo-sqlite';
import {useState, useEffect } from 'react';
import {View} from "react-native";
import {Text} from "react-native-ui-lib";
import {SQLiteDatabase} from "expo-sqlite";
import NewUser from "@/components/NewUser";

export default function HomeScreen() {

    const [hydrationLevel, setHydrationLevel] = useState(100);
    const [newUser, setNewUser] = useState(<NewUser />);

    console.log("Hello World");
    useEffect(() => {
        async function setup() {
            if (await migrateDbIfNeeded() != "new") {
                setNewUser(<h1>NOT A NEW USER</h1>);
            }
        }
        setup();
    }, []);

    return (
        <>
            {newUser}
        </>
    )
}

async function migrateDbIfNeeded() {
    console.log("Migrating DB");
    const db = await SQLite.openDatabaseAsync('hydration.db');
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS records (
                time TIMESTAMP(20),
                steps INT(20),
                hydration INT(20),
                PRIMARY KEY (time)
            );
            CREATE TABLE IF NOT EXISTS preferences (
                name TEXT(20),
                height INT(20),
                weight INT(20),
                gender CHAR(1),
                PRIMARY KEY(name)
            );
            CREATE TABLE IF NOT EXISTS bottles (
                name TEXT(20),
                size INT(20)
            );
        `)
    console.log("Migrated DB");
    const name = await db.getFirstAsync('SELECT name FROM preferences');
    if (name == null) {
        console.log(name);
        return ("new")
    }

}