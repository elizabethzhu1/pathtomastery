// import apiRequest from "./apirequest.js";

export default class Timeline {
  constructor(input, user) {
    this.input = input;
    this.user = user;
  }

  // Methods

  showLoading() {
    loading.style.display = "block";
  }

  hideLoading() {
    loading.style.display = "none";
  }

  // calling the AWS Lambda function
  async callLambda() {
    try {
      console.log(this.input);

      const response = await fetch("https://n6i60djmjj.execute-api.us-east-2.amazonaws.com/generateResponse", {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({ "input": this.input })
      });

      if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async generateTimeline() {
    // show loading text animation
    this.showLoading();

    let response = await this.callLambda();
    console.log("response from lambda: ", response);
    console.log(response.response);

    response = response.response;

    if (!response) {
      alert("There was an error with the server. Please try again!");
      return;
    }

    // hide loading text animation
    this.hideLoading();

    // extract JSON object
    let startIndex = response.indexOf("{");

    let endIndex = response.lastIndexOf("}");
    let responseJSON = response.slice(startIndex, endIndex + 1);
    console.log(responseJSON);

    // process JSON
    let object = JSON.parse(responseJSON); // parse JSON format into an Object
    console.log(object);

    // stores the titles of each step
    let titles = [];
    // elements of this array are each an array of resources for each step
    let descriptions = [];

    const keys = Object.keys(object);
    for (let key of keys) {
      titles.push(key);
      descriptions.push(object[key]);
    }

    // initialize variables
    let title;
    let explanation;
    let link;
    let steptitle;
    let stepexplanation;
    let steplink;

    for (let i = 0; i < titles.length; i++) {
      let bigTitle = document.querySelector("#title" + String(i + 1));
      bigTitle.textContent = "Step " + String(i + 1) + ": \n" + String(titles[i]);
    }

    // loop through each resource in the descriptions array
    for (let i = 0; i < descriptions.length; i++) {
      for (let j = 0; j < descriptions[i].length; j++) {
        title = descriptions[i][j].title;
        explanation = descriptions[i][j].description;
        link = descriptions[i][j].source;

        steptitle = document.querySelector("#s" + String(i + 1) + "t" + String(j + 1));
        steptitle.textContent = title;

        stepexplanation = document.querySelector("#s" + String(i + 1) + "e" + String(j + 1));
        stepexplanation.textContent = explanation;

        steplink = document.querySelector("#s" + String(i + 1) + "l" + String(j + 1));
        steplink.textContent = link;
        steplink.href = link;
      }
    }

    // show the timeline
    timelinewrapper.classList.remove("hidden");

    // return the JSON response object
    return responseJSON;
  }
}
