# GUI node-clipboard-translate
1. [Скачать актуальную версию переводчика](https://raw.githubusercontent.com/william-aqn/node-clipboard-translate/gui/release/clipboard-translate_1.0.2.zip)
2. Распаковать куда нибудь
3. Запустить qode.exe
4. Выбрать переводчик и заполнить API ключ
   * Google free
   * DeepL
   * OpenAI
5. Если не запускается - установить [visual c++ redistributable 2019](https://raw.githubusercontent.com/william-aqn/node-clipboard-translate/gui/release/VC_redist.x64.exe)
6. Проверить что бы в пути отсутствовали пробелы и кириллические символы

*Ctrl+C текст для перевода, ждём, Ctrl+V переведённый текст*
  
![screen](/assets/screen.png)

## Для разработчиков
```
npm run start - запуск
npm run debug - отладка
npm run build - создать zip с релизом
```

Версия без gui доступна в ветке **[simple](https://github.com/william-aqn/node-clipboard-translate/tree/simple)**