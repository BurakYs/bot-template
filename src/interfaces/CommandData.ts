/* eslint-disable semi */
import { CommandBuilder } from '@/helpers/classes';

export default interface CommandData extends Record<keyof CommandBuilder, any> {}