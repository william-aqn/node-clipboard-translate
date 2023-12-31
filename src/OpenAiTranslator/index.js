"use strict";

import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator/index.js';
import { BaseTranslator } from '@translate-tools/core/util/BaseTranslator';
import { Configuration, OpenAIApi } from "openai";

import ClipTranslate from "../index";

var OpenAiTranslator = function (_super) {
  class OpenAiTranslator {
    constructor(options) {
      var _this = _super.call(this, options) || this;
      return _this;
    }
    static getSupportedLanguages() {
      // Пока берём у гугла
      return GoogleTranslator.getSupportedLanguages();
    }
    static isRequiredKey() {
      return true;
    }
    static isSupportedAutoFrom() {
      return true;
    }
    getLengthLimit() {
      return 5000;
    }
    getRequestsTimeout() {
      return 300;
    }
    checkLimitExceeding(text) {
      if (Array.isArray(text)) {
        var arrayLen = text.reduce(function (acc, text) {
          return acc + text.length;
        }, 0);
        var extra = arrayLen - this.getLengthLimit();
        return extra > 0 ? extra : 0;
      } else {
        var extra = text.length - this.getLengthLimit();
        return extra > 0 ? extra : 0;
      }
    }
    async translate(text, from, to) {
      try {
        const translations = await this.translateBatch([text], from, to);
        return translations[0];
      } catch (error) {
        // Обработка ошибки, если необходимо
        console.error(error);
        throw error;
      }
    }
    async translateBatch(text, from, to) {
      if (!text) {
        return [''];
      }
      const promptBuild = `${this.options.prompt}\nText:\n"""#text#\n"""`
        .replace('#from#', from).replace('#to#', to).replace('#text#', text);

      ClipTranslate.setOnlyText(promptBuild)
      console.log(`Prompt [ ${promptBuild} ]`);

      const configuration = new Configuration({
        apiKey: this.options.apiKey,
      });
      const openai = new OpenAIApi(configuration);


      // https://stackoverflow.com/questions/73547502/how-do-i-stream-openais-completion-api
      const getText = async (prompt, callback) => {
        const completion = await openai.createCompletion(
          {
            model: "text-davinci-003",
            //model: "text-curie-001",
            prompt: prompt,
            max_tokens: 500,
            //temperature: 0,
            stream: true,
          },
          { responseType: "stream" }
        );
        return new Promise((resolve) => {
          let result = "";
          completion.data.on("data", (data) => {
            const lines = data
              ?.toString()
              ?.split("\n")
              .filter((line) => line.trim() !== "");
            for (const line of lines) {
              const message = line.replace(/^data: /, "");
              if (message == "[DONE]") {
                resolve(result);
              } else {
                let token;
                try {
                  token = JSON.parse(message)?.choices?.[0]?.text;
                } catch {
                  console.log("ERROR", json);
                }
                result += token;
                if (token) {
                  callback(token);
                }
              }
            }
          });
        });
      };

      ClipTranslate.setOnlyText('')
      const result = await getText(promptBuild, (c) => ClipTranslate.addOnlyText(c))
      console.log(result.trim());
      return [result.trim()];
    }

  }

  OpenAiTranslator.translatorName = 'OpenAiTranslator';
  return OpenAiTranslator;
}(BaseTranslator);
const _OpenAiTranslator = OpenAiTranslator;
export { _OpenAiTranslator as OpenAiTranslator };
