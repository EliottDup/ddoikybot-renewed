import { DBChannel } from "../types/types";
import { execute, fetchAll, fetchFirst } from "./index";

export async function createChannelsTable(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS Channels (
      channel_id VARCHAR(20) PRIMARY KEY,
      user_id VARCHAR(20) NOT NULL,
      server_id VARCHAR(20) NOT NULL,
      last_message VARCHAR(20),
      name VARCHAR(255),
      streak INTEGER,
      high_streak INTEGER,
      draw_counter INTEGER,
      is_alive BOOL,
      FOREIGN KEY(server_id) REFERENCES Servers(id),
      UNIQUE(server_id, user_id)
    );`;
  await execute(sql);
}

export async function getChannelsByServer(serverId: string): Promise<DBChannel[]> {
  return fetchAll<DBChannel>("SELECT * FROM Channels WHERE server_id = ?", [serverId]);
}

export async function getUserChannelInGuild(serverId: string, userId: string): Promise<DBChannel | undefined>{
  return fetchFirst<DBChannel>("SELECT * FROM Channels WHERE server_id = ? AND user_id = ?", [serverId, userId]);

}