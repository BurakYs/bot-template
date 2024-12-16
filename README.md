# 🤖 Discord Bot Template

A template for creating Discord bots with Discord.js using TypeScript

## 📦 Installation

1. Run this codeblock in your terminal:
    ```bash
    git clone https://github.com/BurakYs/bot-template.git
    cd bot-template
    npm install
    cp .env.template .env
    npm run build
    ```
2. Fill in the `.env` file with your bot token
3. Run `npm run register-commands` to register the commands
4. Start the bot with `npm start`

## ✨ Features

- ### Multiple Language Support
    - Add your new language to the `src/localizations` folder and update `supportedLanguages` in the `src/config.ts` file
    - The `src/localizations/commandData` folder contains command names and descriptions
    - The value in `supportedLanguages` must be the same as the file name in the `src/localizations` folder

- ### Command Handler
    - You can create as many subfolders as you want in the `src/commands` folder
    - See the command configurations you can use in the [types](./src/types/index.ts#L12-L22) file
        - If you want to give a subcommand group or a subcommand specific configuration, you can do this:
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

## 📝 License

This project is licensed under the [MIT License](./LICENSE) - see the [LICENSE](./LICENSE) file for details.