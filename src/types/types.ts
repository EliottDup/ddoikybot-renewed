import { SlashCommandBuilder, ChatInputCommandInteraction, Collection, Client, ButtonInteraction, ModalSubmitInteraction } from "discord.js";

export type CommandModule = {
  data: SlashCommandBuilder; 
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
};

export type CommandCollection = Collection<string, CommandModule>;

export type ButtonModule =  {
  name: string; 
  execute(interaction: ButtonInteraction, ...args: string[]): Promise<void>;
};

export type ButtonCollection = Collection<string, ButtonModule>;

export type EventModule = { 
  name: string; once: boolean;
  execute(commands: CommandCollection, ...args: any[]): any
};

export type ModalCollection = Collection<string, ModalModule>;

export type ModalModule =  {
  name: string; 
  execute(interaction: ModalSubmitInteraction, ...args: string[]): Promise<void>;
};

// DB structure & types
export interface DBServer {
  id: string;
  ddoiky_active: boolean;
  main_channel?: string;
  stats_message?: string;
};
export interface DBChannel {
  channel_id: string;
  user_id: string;
  server_id: string;
  last_message?: string;
  name: string;
  streak: number;
  high_streak: number;
  draw_counter: number;
  is_alive: boolean;
};