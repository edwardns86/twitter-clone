const getAppState = () => {
  return (
    JSON.parse(localStorage.getItem("data")) || {
      status: false,
      id: 0,
      tweets: []
    }
  );
};

const maxCharacters = 140;
const inputField = document.getElementById("tweet-content");
let tweetButton = document.getElementById("tweet");
let appState = getAppState();
let url = "https://api.myjson.com/bins/934v2";
inputField.addEventListener("input", checkInput);
inputField.setAttribute("maxLength", maxCharacters);

const getAPI = async () => {
  let result = await fetch(url);
  let json = await result.json();
  let obj = await json.tweets;
  let varWait = await (obj ? true : false);

  // renderTweet(obj)
  appState.tweets = await json;
};

const testPost = async () => {
  const response = await fetch(url, {
    method: "PUT", // or 'PUT'
    body: JSON.stringify(appState.tweets), // data can be `string` or {object}!
    headers: {
      "Content-Type": "application/json"
    }
  });
  const json = await response.json();
  // console.log("Success:", JSON.stringify(json));
};

const saveAppState = obj => {
  localStorage.setItem("data", JSON.stringify(obj));
};

//localStorage.setItem("test", JSON.stringify(appState))

document.getElementById("tweet").style.display = "none";

function createUsername() {
  let currentUser = document.getElementById("currentUsername").value;
  if (currentUser === "") {
    appState.status = false;
    tweetButton.disabled = true;
  } else {
    appState.status = true;
    tweetButton.disabled = false;
    document.getElementById("tweet").style.display = "block";
    renderTweet(appState.tweets);
    console.log("run createUsername");
  }
  console.log("checking our check input", appState);
}

function checkInput() {
  const value = inputField.value;
  const remainChar = maxCharacters - value.length;

  document.getElementById("character").innerHTML = remainChar;

  if (value.length > maxCharacters) {
    tweetButton.disabled = true;
    document.getElementById("character").style.color = "red";
    //  document.getElementById('tweet-content').value = tweetTooLongStyle(value)
  } else {
    document.getElementById("character").style.color = "black";
    tweetButton.disabled = false;
  }
}

function isHashTag(a) {
  const index = appState.tweets.findIndex(tweet => tweet.id == a);
  const value = appState.tweets[index];
  const splitValue = value.content.split(" ");

  const text = splitValue
    .map(word => {
      const firstChar = word[0];
      if (firstChar === "#") {
        appState.tweets[index].hashtags.push(word);
        return `
                <a href ="#" onclick="searchHashtag('${word}')">${word}</a>            
            `;
      } else return word;
    })
    .join(" ");
  return text;
}

function tweetTooLongStyle(tweetStringTooLong) {
  /// Not being called use if we ever get to this user story
  let tweetTooLong = tweetStringTooLong.substring(
    maxCharacters - 1,
    tweetStringTooLong.length
  );
  return `<span style = "background-color : 'red'" > ${tweetTooLong} </span>`;
}

function printName(name) {
  console.log("Hello", name);
}

function addTweet() {
  let currentUser = document.getElementById("currentUsername").value;
  let tweetcontent = document.getElementById("tweet-content").value;
  if (tweetcontent === "") return;
  let obj = {
    id: appState.id++,
    username: currentUser,
    content: tweetcontent,
    hashtags: [],
    date: new Date(),
    liked: false,
    replies: [],
    isRetweeted: false
  };
  appState.tweets.unshift(obj);

  renderTweet(appState.tweets);
  document.getElementById("tweet-content").value = "";
  testPost();
}

function renderTweet(tweets) {
  const tweetHTML = tweets
    .map(tweet => {
      let orignalTweetHTML = "";
      const parentID = tweet.parentID;
      if (parentID != null && parentID != undefined) {
        let originalTweet = tweets.filter(tweet => tweet.id === parentID);
        console.log(originalTweet)
        console.log(originalTweet.length === 0)

        if (originalTweet.length > 0) {
          orignalTweetHTML = originalTweet
            .map(original => {
              return `
                  <div class="tweet-head">
                      <div>
                        <p class="info-card">
                        <img class="profile-img" src="img/profile.png" alt=""/>
                          <b class="username usernamestyle">${
                            original.username
                          }</b> 
                          <i class="date">${moment(original.date).fromNow()}</i>
                        </p>
                      </div>
                  </div>
                  <div class="content-box">
                      <p class="text-content">${isHashTag(original.id)}</p>
                    </div>
                  
                `;
            })
            .join("");
        } else {
          orignalTweetHTML = `
          <div style="text-align: center"><h1>Post was deleted</h1></div>
          `;
        }
      }

      const tweetReplies = tweet.replies
        .map(reply => {
          return `
        <hr>
        <div class="comment-card>
            <div>
                <p>
                <span class="comment-username"><b class="username">${
                  reply.user
                }</b><span><span class="comment-word">commented</span> 
                <i class="date-comment">${moment(reply.date).fromNow()}</i>
                <div class="comment-box" >
                <h6 class="comment-content">${reply.content}</h6>
                </div>
                </p>
            </div>
        </div>`;
        })
        .join("");
      return `
        <div class="col-lg-12 col-md-12 col-xs-12 custom-card">
            <div class="tweet-head">
              <div>
                <p class="info-card">
                <img class="profile-img" src="img/profile.png" alt=""/>
                  <b class="username usernamestyle">${tweet.username}</b> 
                  <i class="date">${moment(tweet.date).fromNow()}</i>
                </p>
              </div>
            </div>
            <div class="content-box">
              <p class="text-content">${isHashTag(tweet.id)}</p>
            </div>
            <div class="button-container">
              <button class="btn like-btn" onclick="like(${tweet.id})">
              <i class="fas fa-hotdog"></i> <span class="icon-text" id="like-${
                tweet.id
              }">${!tweet.liked ? "Like" : "Unlike"}</span>
              </button>
              <button class="btn" onclick="replies(${tweet.id})">
              <i class="fas fa-comment-alt"></i><span class="icon-text">Comment</span>
              </button>
              <button class="btn" onclick="retweet(${tweet.id})">
              <i class="fas fa-dog"></i></i><span class="icon-text">Rewoof</span>
              </button>
              <button class="btn btn-delete delete-hover" onclick="deleteTweet(${
                tweet.id
              })">
                <i class="far fa-trash-alt"></i><span class="icon-delete-text">Delete</span>
              </button>
            </div>
            <div class="origin-tweet" id="original-${tweet.id}">
              ${orignalTweetHTML}
            </div>
            <div id="retweet-${tweet.id}">
              ${tweetReplies}
            </div>
          </div>
        `;
    })
    .join("");

  document.getElementById("board").innerHTML = tweetHTML;
  document.getElementById("count").innerHTML = tweets.length; // number of tweets
  appState.status = true;
  saveAppState(appState);
  orignalTweetHTML = "";
}

function replies(a) {
  let index = appState.tweets.findIndex(tweet => tweet.id === a);
  let currentUser = document.getElementById("currentUsername").value;
  const getTweet = appState.tweets[index];
  let promtInput = prompt("enter your message");

  const commentHTML = document.getElementById(`retweet-${a}`).innerHTML;
  const obj = {
    content: promtInput,
    user: currentUser,
    date: new Date()
  };

  const retweetHTML = `   
        <div class="comment-card">
            <div>
            <h1>${promtInput}</h1>
            </div>
            <div>
                <p>
                <b class="username">${currentUser}</b> commented at
                <i>${moment(new Date()).fromNow()}</i>
                </p>
            </div>
        </div>
        
        
        <div class="comment-card>
            <div>
                <p>
                <span class="comment-username"><b class="username">${
                  reply.user
                }</b><span><span class="comment-word">commented</span> 
                <i class="date-comment">${moment(reply.date).fromNow()}</i>
                <div class="comment-box" >
                <h6 class="comment-content">${reply.content}</h6>
                </div>
                </p>
            </div>
        </div>
        `;
  document.getElementById(`retweet-${a}`).innerHTML = commentHTML + retweetHTML;
  appState.tweets[index].replies.push(obj);
  testPost();
}

function retweet(a) {
  const currTweet = appState.tweets.filter(tweet => tweet.id === a);
  const inputField = document.getElementById("tweet-content");
  currTweet[0].isRetweeted = true;
  const whyYouShare = prompt("Why you share ?");
  let obj = {
    id: appState.id++,
    username: `${inputField.value}`,
    content: `${whyYouShare} ` + currTweet[0].content,
    hashtags: [],
    date: new Date(),
    liked: false,
    replies: [],
    parentID: currTweet[0].id,
    isRetweeted: false
  };

  appState.tweets.unshift(obj);
  renderTweet(appState.tweets);
  testPost();
}

function like(a) {
  let index = appState.tweets.findIndex(tweet => tweet.id === a);
  const getTweet = appState.tweets[index];
  getTweet.liked = !getTweet.liked;

  !getTweet.liked
    ? (document.getElementById(`like-${a}`).innerHTML = "Like")
    : (document.getElementById(`like-${a}`).innerHTML = "Unlike");
  console.log("like appstate", appState.tweets[index]);
  testPost();
}

function deleteTweet(a) {
  let index = appState.tweets.findIndex(tweet => tweet.id === a);
  appState.tweets.splice(index, 1);
  renderTweet(appState.tweets);
  testPost();
}

function searchHashtag(selectedHashTag) {
  const result = appState.tweets.filter(tweet => {
    if (tweet.hashtags.includes(selectedHashTag)) return tweet;
  });

  renderTweet(result);
}

getAPI();
