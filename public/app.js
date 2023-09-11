import apiRequest from "./apirequest.js";
import Timeline from "./timeline.js";

export default class App {
  constructor() {
    // initialize a user
    this.user = null;

    this.timelinewrapper = document.querySelector("#timelinewrapper");
    this.loading = document.querySelector("#loading");

    // adding event listener on login form
    this.loginForm = document.querySelector("#loginForm");
    this.onLogin = this.onLogin.bind(this);
    this.loginForm.addEventListener("submit", this.onLogin);

    // adding event listener on view users button
    this.viewUsersButton = document.querySelector("#viewUsers");
    this.viewUsers = this.viewUsers.bind(this);
    this.viewUsersButton.addEventListener("click", this.viewUsers);

    // listen for a user topic input to generate timeline
    this.form = document.querySelector("#form");
    this.onForm = this.onForm.bind(this);
    form.addEventListener("submit", this.onForm);

    // adding event listener on view timelines button
    this.viewTopicsButton = document.querySelector("#viewTopics");
    this.viewTopics = this.viewTopics.bind(this);
    this.viewTopicsButton.addEventListener("click", this.viewTopics);
  }

  // Methods

  async onLogin(event) {
    // prevents refresh
    event.preventDefault();

    // load user profile
    const username = event.target.elements.userInput.value;
    console.log(username);

    // store the user in a class variable
    this.user = username;

    if (username === "") {
      alert("Please enter a username!");
    } else {
      // write welcome message
      let subtitle = document.querySelector("#subtitle");
      subtitle.innerText = "Welcome, " + String(username) + "! What do you want to learn today?";

      // add the new user to the database
      try {
        await apiRequest("POST", `/newuser/${username}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  async viewUsers(event) {
    event.preventDefault();
    const allUsers = await apiRequest("GET", "/users");
    console.log(allUsers.users);
    let usernames = allUsers.users.map(((user) => user.username));
    alert("Users: " + String(usernames));
  };

  async viewTopics(event) {
    event.preventDefault();

    // only display timelines if the user is logged in
    if (this.user) {
      const topicsObject = await apiRequest("GET", `/gettopics/${this.user}`);
      const topicsArray = topicsObject.topics;
      console.log(topicsArray);
      alert(topicsArray);
    }
  }

  async onForm(event) {
    // prevents refresh
    event.preventDefault();

    timelinewrapper.classList.add("hidden");

    let input = document.querySelector("#topic").value;

    const timeline = new Timeline(input, this.user);
    await timeline.generateTimeline(input);

    const user = await apiRequest("PATCH", `/addtopic/${this.user}`, { topic: input });
    console.log(user);
  }
}

