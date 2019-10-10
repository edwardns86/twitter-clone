const maxCharacters = 140;
const inputField = document.getElementById('tweet-content');
const tweetButton = document.getElementById('tweet');
let id = 0;
inputField.addEventListener('input', checkInput);
inputField.setAttribute("maxLength", maxCharacters);


function checkInput() {
    const value = inputField.value;
    const remainChar = maxCharacters - value.length;
    document.getElementById('character').innerHTML = remainChar;
    if (value.length > maxCharacters) {
        tweetButton.disabled = true;
        document.getElementById('character').style.color = 'red'
        //  document.getElementById('tweet-content').value = tweetTooLongStyle(value)

    } else {
        document.getElementById('character').style.color = 'black';
        tweetButton.disabled = false;
    }
}

let appState = {
    status: false,
    tweets: []
}

function isHashTag(a) {
    console.log("app state", appState);
    const index = appState.tweets.findIndex( tweet => tweet.id == a);
    const value = appState.tweets[index];
    console.log(value)
    const splitValue = value.content.split(' ');

    const text = splitValue.map(word => {
        const firstChar = word[0];
        if (firstChar === "#") {
            appState.tweets[index].hashtags.push(word)
            return `
                <a href ="#">${word}</a>            
            `
        }
        else
            return word;
    }).join(" ")
    return text
}

function tweetTooLongStyle(tweetStringTooLong) {  /// Not being called use if we ever get to this user story
    let tweetTooLong = tweetStringTooLong.substring(maxCharacters - 1, tweetStringTooLong.length)
    return `<span style = "background-color : 'red'" > ${tweetTooLong} </span>`
}

function printName(name) {
    console.log("Hello", name)
}

function addTweet() {
    let tweetcontent = document.getElementById("tweet-content").value;
    let obj = {
        id: id++,
        username: "anonymous",
        content: tweetcontent,
        hashtags: [],
        date: new Date(),
        liked: false,
        retweet: []
    };
    appState.tweets.push(obj);
    // console.log(appState)

    renderTweet(appState);
    document.getElementById('tweet-content').value = "";
}

function renderTweet(appState) {
    let tweets = appState.tweets;

    const tweetHTML = tweets.map(tweet => {
        console.log("id",tweet.id)
        return `
        <h1>${isHashTag(tweet.id)}</h1>
        <h2>${tweet.username}</h2>
        <p>${tweet.date}</p>
        <button class="btn retweet-btn" onclick="retweet(${tweet.id})">Retweet</button>
        <button id="like-${tweet.id}"class="btn like-btn" onclick="like(${tweet.id})">Like</button>
        <button class="btn btn-danger" onclick="deleteTweet(${tweet.id})">Delete</button>
        <div id="retweet-${tweet.id}"></div>
        `
    }).join('')

    document.getElementById('board').innerHTML = tweetHTML;
    document.getElementById('count').innerHTML = tweets.length; // number of tweets
}

function retweet(idx) {
    const getTweet = appState.tweets[idx];
    let promtInput = prompt("enter your message")
    const obj = {
        name: promtInput
    }
    console.log(getTweet)
    const retweetHTML = `   
        <h1>Retweet with love by ${promtInput}</h1>
        <h6>${getTweet.content}</h6>
        <h2>${getTweet.username}</h2>
        <p>${new Date()}</p>
       

        `
    document.getElementById(`retweet-${idx}`).innerHTML = retweetHTML;
    appState.tweets[idx].retweet.push(obj)
}

function like(idx) {
    const getTweet = appState.tweets[idx];
    getTweet.liked = !getTweet.liked;
    getTweet.liked ? document.getElementById(`like-${idx}`).innerHTML = 'Like' : document.getElementById(`like-${idx}`).innerHTML = 'Unlike';
}

function deleteTweet(a) {
    let index = appState.tweets.findIndex( tweet => tweet.id === a);
    appState.tweets.splice(index, 1)
    renderTweet(appState);
}
