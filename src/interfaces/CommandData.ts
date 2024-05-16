/* eslint-disable semi */
import { SlashCommandBuilder } from 'discord.js';

export default interface CommandData extends Record<keyof SlashCommandBuilder, any> {}