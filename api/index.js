import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";

// my imports
import { Configuration, OpenAIApi } from "openai";
import { MongoClient } from "mongodb";

export const config = {
  runtime: "edge"
};

let api = express.Router();

// load env variables
dotenv.config();

const OPENAIKEY = process.env.OPENAIKEY;

const configuration = new Configuration({
  apiKey: OPENAIKEY
});

const openai = new OpenAIApi(configuration);

const initApi = async (app) => {
  app.set("json spaces", 2);
  app.use("/api", api);

  const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1";

  // set up MongoDB connection + collection variables
  const connection = await MongoClient.connect(MONGODB_URL);
  db = connection.db("mastery");

  // create a users collection
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map((collection) => collection.name);

  if (!collectionNames.includes("users")) {
    await db.createCollection("users");
  }

  // get that collection and store in a variable
  users = db.collection("users");
};

api.use(bodyParser.json());
api.use(cors());

// API endpoint #1: uses OpenAI API to generate a response to the prompt
api.post("/generateresponse", async (req, res) => {
  // get user input
  const input = req.body.input;

  console.log("Input: " + input);
  let prompt = `Generate a comprehensive, step-by-step learning guide to master ${input}. 
  Your response should be a complete JSON object with 5 properties for each skill to learn ${input}.
  Each property key consists of a few words specifically describing the skill the user is supposed to learn.
  Each property maps to an array of strictly 2 JSON objects, where each object consists of 3 properties: 
  "title", "description", and "source" (which is a working link to the resource).`;
  console.log("Prompt: " + prompt);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { "role": "system", "content": "You are a helpful assistant who is tasked with helping a user learn a subject of their choosing in a comprehensive way." },
      { "role": "user", "content": prompt }
    ],
    max_tokens: 500
  });

  // return response to frontend
  res.json({ response: response.data.choices[0].message.content });
});

// API endpoint #3: gets all users
api.get("/users", async (req, res) => {
  const allUsers = await users.find().toArray();
  let object = {};
  object["users"] = allUsers;
  console.log(object);
  res.json(object);
});

// API endpoint #4: adds topic to user's topics array
api.patch("/addtopic/:username", async (req, res) => {
  const topic = req.body.topic;
  const username = req.params.username;
  const user = await getUser(username);
  if (user) {
    user.topics.push(topic);
    const filter = { "username": username };
    const update = { $set: { "topics": user.topics } };
    users.findOneAndUpdate(filter, update);
  }
  res.json( { "user": user });
});

// API endpoint #5: gets array of all topics for a particular user
api.get("/gettopics/:username", async (req, res) => {
  let object = {};
  const username = req.params.username;
  const user = await getUser(username);
  object["topics"] = user.topics;
  res.json(object);
});

// API endpoint #6: gets array of all timelines for a particular user

// retrieves a user, given their username
const getUser = async (username) => {
  const allUsers = await users.find().toArray();
  const foundUser = allUsers.find((user) => user.username === username);
  return foundUser;
};

/* Catch-all route to return a JSON error if endpoint not defined.
   Be sure to put all of your endpoints above this one, or they will not be called. */
api.all("/*", (req, res) => {
  res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.url}` });
});

export default initApi;
