import { DBChannel } from "../types/types";
import { execute, fetchAll, fetchFirst } from "./index";

export async function createChannelsTable(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS Channels (
      channel_id VARCHAR(20) PRIMARY KEY,
      user_id VARCHAR(20) NOT NULL,
      server_id VARCHAR(20) NOT NULL,
      last_message VARCHAR(20),
      name VARCHAR(255) NOT NULL,
      streak INTEGER NOT NULL DEFAULT 0,
      high_streak INTEGER NOT NULL DEFAULT 0,
      draw_counter INTEGER NOT NULL DEFAULT 0,
      is_alive BOOL NOT NULL DEFAULT 0,
      FOREIGN KEY(server_id) REFERENCES Servers(id),
      UNIQUE(server_id, user_id),
      UNIQUE(server_id, name)
    );`;
  await execute(sql);
}

export async function upsertChannel(channel: DBChannel): Promise<void> {
  await execute(
    `INSERT OR REPLACE INTO Channels (channel_id, user_id, server_id, last_message, name, streak, high_streak, draw_counter, is_alive) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [channel.channel_id, channel.user_id, channel.server_id, channel.last_message, channel.name, channel.streak, channel.high_streak, channel.draw_counter, channel.is_alive]
  );
}

export async function getChannelsByServer(serverId: string): Promise<DBChannel[]> {
  return fetchAll<DBChannel>("SELECT * FROM Channels WHERE server_id = ?", [serverId]);
}

export async function getChannelByNameInGuild(serverId: string, name: string): Promise<DBChannel | undefined>{
  return fetchFirst<DBChannel>("SELECT * FROM Channels WHERE server_id = ? AND name = ?", [serverId, name]);
}

export async function getUserChannelInGuild(serverId: string, userId: string): Promise<DBChannel | undefined>{
  return fetchFirst<DBChannel>("SELECT * FROM Channels WHERE server_id = ? AND user_id = ?", [serverId, userId]);
}

export async function getChannelById(channelId: string): Promise<DBChannel | undefined> {
  return fetchFirst<DBChannel>("SELECT * FROM Channels WHERE channel_id = ?", [channelId]);
}