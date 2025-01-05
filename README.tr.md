# 🤖 Discord Bot Altyapısı

TypeScript ve Discord.js kullanarak Discord botları yapabileceğiniz bir altyapı

## 📦 Kurulum

1. Bu kod bloğunu terminalinizde çalıştırın:
    ```bash
    git clone https://github.com/BurakYs/bot-template.git
    cd bot-template
    npm install
    cp .env.template .env
    npm run build
    ```
2. `.env` dosyasını bot token'ınız ile doldurun
3. Komutları Discord'a yüklemek için `npm run register-commands` komutunu çalıştırın
4. Botu `npm start` ile başlatın

## ✨ Özellikler

- ### Çoklu Dil Desteği
    - Yeni bir dil eklemek için dosyayı `src/localizations` klasörüne ekleyin ve `src/config.ts` dosyasındaki `supportedLanguages` dizisini güncelleyin
    - Komut adları ve açıklamaları `src/localizations/commandData` klasöründe saklanır
    - `src/localizations` klasöründeki dosyaların adıyla `supportedLanguages` içindeki değerlerin eşleştiğinden emin olun

- ### Komut Handlerı
    - `src/commands` klasöründe istediğiniz kadar alt klasör oluşturabilirsiniz
    - Kullanabileceğiniz configler için [types](./src/types/index.ts#L12-L22) dosyasına bakın
        - Bir alt komuta belirli bir config vermek için şunu yapın:
          ```ts
          config: {
            someOtherConfig: true,
            configName: {
              '*': false, // Varsayılan config
              'groupName subCommandName': true, // Bu alt komut için özel config
              // veya
              'subCommandName': true
            }
          }
          ```

## 📝 Lisans

Bu proje [MIT Lisansı](./LICENSE) altında lisanslanmıştır - ayrıntılar için [LICENSE](./LICENSE) dosyasına bakın.