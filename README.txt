CS193X Final Project
====================

Project Title: Path to Mastery
Your Name: Elizabeth Zhu
Your SUNetID: elizhu

Overview
--------
Creates an educational learning path for a user on any given topic!

Running
-------
Should be good as is, since openai should be included in package.json. I've mainly tested the app on Safari and Arc, although it should also work on Chrome.

Do we need to load data from init_db.mongodb? No.

Features
--------
Broadly:
- User can type in any input and the app will generate an interactive learning timeline, with steps outlining skills and resources that the user can learn in order to master the topic.
- User can login (new users can sign up via the same button) and the app will display a "Welcome [user]!" message, record the user into the users collection in the MongoDB database, and record all topics that the user has inputted.
- User can click a button to view all users currently logged into the database.
- User can click a button to view all topics that they have inputted in the past, while logged in.
- Once a timeline is generated, user can hover over each circle to learn more about that step -- it should generate a description box.


Collaboration and libraries
---------------------------
- OpenAI API + documentation
- Typed.JS for the loading typing animation
- Used some CSS documentation for the hover over button rainbow effect on "Generate Pathway"
- Some gradient libraries?
- Took inspiration from Assignment 3.2 for the API endpoints and backend features

Anything else?
-------------
I still plan on continuing this project! Ran out of time to fully implement some of the features I wanted to, but I want to code a feature to save full timelines rather than just topics, and a feature to recommend other topics the user might be interested in. Would love any feedback on where to take this.
