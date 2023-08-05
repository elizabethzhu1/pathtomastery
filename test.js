/* eslint-disable */

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    // extract my openai API key from .env
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const prompt = "Generate a comprehensive, step-by-step learning guide to master on coding";

async function generatePathway(prompt) {
    const response = await openai.createCompletion ({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 200, 
    })
    console.log(response.data.choices[0].text);
}

generatePathway(prompt);