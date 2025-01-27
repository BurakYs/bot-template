const requiredVariables: (keyof NodeJS.ProcessEnv)[] = ['BOT_TOKEN'];
const missingVariables = requiredVariables.filter(env => !process.env[env]);

if (missingVariables.length) {
  global.logger.fatal(`Missing environment variables: ${missingVariables.join(', ')}`);
  process.exit(1);
}