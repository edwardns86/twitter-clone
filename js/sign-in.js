
const getAppState = () => {
    return (
        JSON.parse(localStorage.getItem("data")) || {
            status: false,
            id: 0,
            tweets: [],
            loggedInUser: "null"
        }
    );
};

let appState = getAppState();

const saveAppState = obj => {
    localStorage.setItem("data", JSON.stringify(obj));
};

function createUsername() {
    
    console.log("test beginning",appState)
    let currentUser = document.getElementById("signInUsername").value;
    console.log("usercheck" , currentUser)
    if (currentUser === "") {
      appState.status = false;
      //tweetButton.disabled = true; 
    } else {
      
      appState.loggedInUser = currentUser ;
      appState.status = true;
      saveAppState()
      //window.open("index.html"); // ED -- Adding window open so that on click sign in page takes you to the index.html
      
      //tweetButton.disabled = false;
      document.getElementById("tweet").style.display = "block";
      renderTweet(appState.tweets);
    }
    console.log("did username come thorugh", appState);
  }