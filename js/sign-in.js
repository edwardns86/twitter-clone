signInUsername.addEventListener("input", () => {
  if (signInUsername.value.length > 0) {
    signinButton.removeAttribute("disabled");
  } else {
    signinButton.setAttribute("disabled", "disabled");
  }
});

function logIn() {
  let loginUser = document.getElementById("signInUsername").value;
  let myObj = {
    loggedInUser: loginUser,
    status : true,
    id : null
    // password: "******"
  };
  let myObj_serialized = JSON.stringify(myObj);
  localStorage.setItem("data", myObj_serialized);
  window.open("board.html", "_self");
}

let myObj_deserialized = JSON.parse(localStorage.getItem("data"));

//  const getAppState = () => {
//     return (
//         JSON.parse(localStorage.getItem("data")) || {
//             status: false,
//             id: 0,
//             tweets: [],
//             loggedInUser: "null"
//         }
//     );
// };

// let appState = getAppState();

// const saveAppState = obj => {
//     localStorage.setItem("data", JSON.stringify(obj));
// };

// function createUsername() {

//     console.log("test beginning",appState)
//     let currentUser = document.getElementById("signInUsername").value;
//     console.log("usercheck" , currentUser)
//     if (currentUser === "") {
//       appState.status = false;
//       //tweetButton.disabled = true;
//     } else {

//       appState.loggedInUser = currentUser ;
//       appState.status = true;
//       saveAppState()
//       //window.open("index.html"); // ED -- Adding window open so that on click sign in page takes you to the index.html

//       //tweetButton.disabled = false;
//       document.getElementById("tweet").style.display = "block";
//       renderTweet(appState.tweets);
//     }
//     console.log("did username come thorugh", appState);
//   }


if(myObj_deserialized != null) {
  console.log('run')
  if(myObj_deserialized.loggedInUser != "") window.open("board.html", "_self")
}