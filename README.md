# 🤖 Discord Bot Template

A template for creating Discord bots with Discord.js using TypeScript

## 📦 Installation

1. Run this codeblock in your terminal:
    ```bash
    git clone https://github.com/BurakYs/bot-template.git
    cd bot-template
    pnpm install
    cp .env.template .env
    ```
2. Fill in the `.env` file with your bot token
3. Run `pnpm register-commands` to register the commands
4. Start the bot with `pnpm start`

## ✨ Features

- ### Multiple Language Support
    - Uses the `i18next` library for localization
    - To add a new language, add the file in `src/localizations` folder and update `supportedLanguages` array in `src/config.ts`
    - Command names and descriptions are stored in the `src/localizations/commandData` folder

- ### Command Handler
    - You can create as many subfolders as you want in the `src/commands` folder
    - Refer to the available command configurations in the [types](src/types/index.d.ts#L12-L22) file
        - To give a subcommand a specific configuration, do this:
          ```ts
          config: {
            someOtherConfig: true,
            configName: {
              '*': false, // Default configuration
              'groupName subCommandName': true, // Specific configuration for this subcommand
              // or
              'subCommandName': true
            }
          }
          ```

- ### Utility Functions
    - `interaction.success()`: Sends a success message
    - `interaction.error()`: Sends an error message
    - `interaction.translate()`: Translates a key

## 📝 License

This project is licensed under the [MIT License](./LICENSE) - see the [LICENSE](./LICENSE) file for details.
