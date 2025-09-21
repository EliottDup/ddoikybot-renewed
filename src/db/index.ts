import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import path from "path";

let db: Database | null = null;

export async function createConnection() {
    const dbpath = path.join(path.join(path.dirname(path.dirname(__dirname)), "data"), "data.db");
    db = await open({
        filename: dbpath,
        driver: sqlite3.Database
    });
    console.log("Connection to DB created :3");
}

export async function closeConnection(){
    if (!db) return;
    await db.close();
    console.log("Connection to DB closed!");
}

export async function execute(sql: string, params: any[] = []) {
  if (!db) throw new Error("DB not initialized.");
  return db.run(sql, params);
}

export async function fetchAll<T>(sql: string, params: any[] = []): Promise<T[]> {
  if (!db) throw new Error("DB not initialized.");
  return db.all<T[]>(sql, params);
}

export async function fetchFirst<T>(sql: string, params: any[] = []): Promise<T | undefined> {
  if (!db) throw new Error("DB not initialized.");
  return db.get<T>(sql, params);
}