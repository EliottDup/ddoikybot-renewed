import { DBServer } from "../types/types";
import { execute, fetchFirst } from "./index";

export async function createServersTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS Servers (
      id VARCHAR(20) PRIMARY KEY,
      ddoiky_active BOOL,
      main_channel VARCHAR(20),
      stats_message VARCHAR(20)
    );
  `;
  await execute(sql);
}

export async function getServer(id: string): Promise<DBServer | undefined> {
  return fetchFirst<DBServer>("SELECT * FROM Servers WHERE id = ?", [id]);
}

export async function upsertServer(server: DBServer) {
  await execute(
    `INSERT OR REPLACE INTO Servers (id, ddoiky_active, main_channel, stats_message) 
     VALUES (?, ?, ?, ?)`,
    [server.id, server.ddoiky_active, server.main_channel, server.stats_message]
  );
}

export async function deleteServer(serverID: string){
  await Promise.all([
    execute(`DELETE FROM Servers WHERE id = ?`, [serverID]),
    execute(`DELETE FROM Channels WHERE server_id == ?`, [serverID])
    ]);
}