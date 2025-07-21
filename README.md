# 🤖 Discord Bot Template

A TypeScript template for creating Discord bots with discord.js

## 📦 Setup

1. Clone the repo and install dependencies:
    ```sh
    git clone https://github.com/BurakYs/bot-template.git
    cd bot-template
    pnpm install
    cp .env.template .env
    ```

2. Add your bot token to the `.env` file
3. Register slash commands:
    ```sh
    pnpm register-commands
    ```
4. Start the bot:
    ```sh
    pnpm start
    ```

## ✨ Features

### 🌐 Localization

- Add new languages by:
    - Creating a JSON file in `src/localizations`
    - Updating the `supportedLanguages` array in `src/config.ts`
- Command names/descriptions are in `src/localizations/commandData`

### ⚙️ Command Handler

- Organize commands in subfolders under `src/commands`
- See [`types/index.d.ts`](src/types/index.d.ts#L18-L31) for config structure
- Example of a subcommand-specific config:
    ```ts
    {
      config: {
        someOtherConfig: true,
        premiumOnly: {
          '*': false, // Default
          'subcommandName': true, // Only for this subcommand
          'groupName subcommandName': true, // For group subcommands
        }
      }
    }
    ```

### 🛠 Utility Functions

- [`interaction.success()`](src/types/discordjs.d.ts#L10-L12) - Sends a success message
- [`interaction.error()`](src/types/discordjs.d.ts#L14-L16) - Sends an error message
- [`interaction.translate()`](src/types/discordjs.d.ts#L8) - Translates a key using the current language

## 📝 License

This project is licensed under the [MIT License](./LICENSE).
