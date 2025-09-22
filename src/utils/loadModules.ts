import { Collection, Interaction } from "discord.js";
import { readdirSync } from "fs";
import path from "path";

export function loadModules<T extends {name: string, execute(interaction: Interaction, ...args: string[]): Promise<void>}>(basePath: string, folder: string): Collection<string, T>{
    const collection = new Collection<string, T>();

    const folderPath = path.join(basePath, folder);
    const files = readdirSync(folderPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    
    for (const file of files){
        const mod: T = require(path.join(folderPath, file));
        collection.set(mod.name, mod);
    }

    return collection;
}