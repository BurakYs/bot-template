import type Client from '@/loaders/base';
import type { Interaction } from '@/interfaces';

export type RunFunctionOptions = { client: Client, interaction: Interaction, translations: Record<string, any> }
export type RunFunction = (options: RunFunctionOptions) => Promise<unknown>;