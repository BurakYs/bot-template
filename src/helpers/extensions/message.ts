import { ChatInputCommandInteraction, Message, MessageComponentInteraction } from 'discord.js';
import utils from '@/helpers';

import type { Interaction, SendMessageOptions } from '@/interfaces';

export default function () {
  const embedMessages = {
    error: {
      value(options: SendMessageOptions) {
        return utils.sendError(this as unknown as Interaction, options);
      }
    },
    success: {
      value(options: SendMessageOptions) {
        return utils.sendSuccess(this as unknown as Interaction, options);
      }
    }
  };

  Object.defineProperties(Message.prototype, embedMessages);
  Object.defineProperties(ChatInputCommandInteraction.prototype, embedMessages);
  Object.defineProperties(MessageComponentInteraction.prototype, embedMessages);
}