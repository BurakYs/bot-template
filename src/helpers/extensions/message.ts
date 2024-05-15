import { ChatInputCommandInteraction, Message, MessageComponentInteraction } from 'discord.js';
import { messages } from '../functions';
import { Interaction, SendMessageOptions } from '@/interfaces';

export default function () {
    const embedMessages = {
        error: {
            value(options: SendMessageOptions) {
                return messages.sendError(this as unknown as Interaction, options);
            }
        },
        success: {
            value(options: SendMessageOptions) {
                return messages.sendSuccess(this as unknown as Interaction, options);
            }
        }
    };

    Object.defineProperties(Message.prototype, embedMessages);
    Object.defineProperties(ChatInputCommandInteraction.prototype, embedMessages);
    Object.defineProperties(MessageComponentInteraction.prototype, embedMessages);

    return true;
}