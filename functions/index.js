/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
// import { onRequest } from "firebase-functions/v2/https";
// import logger from "firebase-functions/logger";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
// import { MongoClient } from "mongodb";

// The Firebase Admin SDK to access Firestore.
// const { initializeApp } = require("firebase-admin/app");
// const { getFirestore } = require("firebase-admin/firestore");

// initializeApp();

// const api = express.Router();

// load env variables
dotenv.config();

const OPENAIKEY = process.env.OPENAIKEY;

const configuration = new Configuration({
  apiKey: OPENAIKEY,
});

const openai = new OpenAIApi(configuration);

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const generateResponse = functions.https.onRequest(async (req, res) => {
  // get user input
  const input = req.body.input;

  console.log("Input: " + input);
  const prompt = `Generate a comprehensive, step-by-step learning guide to master ${input}. 
  Your response should only be in JSON. The JSON object must have 5 properties that correspond to each skill developed in the learning process, ordered in a way that enables a layperson to most effectively learn ${input}. 
  Each property key consists of a few words specifically describing the skill the user is supposed to learn. An example of a property value could be "Learning the Fundamentals" or "Getting More Practice".
  Each property maps to an array of strictly 2 JSON objects, where each object consists of strictly 3 properties: 
  "title", "description", and "source". The "title" property maps to the title of the resource. 
  The "description" property maps to a short 1 line description about what the resource is / what it does.
  The "source" property maps to a working link where the user can access the resources.
  You must ensure your response is a complete JSON object that is under 600 tokens.`;
  console.log("Prompt: " + prompt);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { "role": "system", "content": "You are a helpful assistant who is tasked with helping a user learn a subject of their choosing in a comprehensive way." },
      { "role": "user", "content": prompt },
    ],
  });

  // return response to frontend
  res.json({ response: response.data.choices[0].message.content });
});
