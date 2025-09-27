import { readdirSync, readFileSync } from "fs";
import path from "path"
import { Database } from "sqlite"
import { execute, fetchFirst } from ".";

export async function createMigrationsTable(){
    await execute(`
        CREATE TABLE IF NOT EXISTS Migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

export async function applyMigrations(){
    await createMigrationsTable();
    const migrationsPath = path.join(__dirname, "migrations");
    const files = readdirSync(migrationsPath).sort();

    for (const file of files){
        const sql = readFileSync(path.join(migrationsPath, file), "utf8");
        await runMigration(file, sql);
    }
}

async function runMigration(name:string, sql: string){
    const applied = await fetchFirst(`SELECT name FROM Migrations WHERE name = ?`, [name]);
    if (!applied){
        await execute(sql);
        await execute("INSERT INTO Migrations (name) VALUES (?)", [name]);
        console.log(`Applied migration ${name}`);
    }
}