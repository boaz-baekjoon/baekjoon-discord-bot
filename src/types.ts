import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";

type SlashCommandData =
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

export interface BotCommand {
    data: SlashCommandData;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export function getTierName(tier: number): string {
    if (tier >= 1 && tier <= 5) return `브론즈 ${6 - tier}`;
    if (tier >= 6 && tier <= 10) return `실버 ${11 - tier}`;
    if (tier >= 11 && tier <= 15) return `골드 ${16 - tier}`;
    if (tier >= 16 && tier <= 20) return `플레티넘 ${21 - tier}`;
    if (tier >= 21 && tier <= 25) return `다이아 ${26 - tier}`;
    if (tier >= 26 && tier <= 30) return `루비 ${31 - tier}`;
    if (tier === 31) return `마스터`;
    return `언랭`;
}
