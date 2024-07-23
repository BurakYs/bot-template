/* eslint-disable no-var */
import type { Logger } from '@/utils/classes';

declare global {
  var logger: Logger;

  interface String {
    change(replacements: Record<string, unknown>): string;
  }
}