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
    tweet: []

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
        username: "test",
        content: tweetcontent,
        hashtags: [],
        date: new Date(),
        liked: false,
        retweet: []
    };
    appState.tweet.push(obj);
    console.log(appState)

    renderTweet(appState);
    document.getElementById('tweet-content').value = "";
}

function renderTweet(appState) {
    let tweets = appState.tweet;

    const tweetHTML = tweets.map(tweet => {
        return `
        <h1>${tweet.content}</h1>
        <h2>${tweet.username}</h2>
        <p>${tweet.date}</p>
        <button class="btn" onclick="retweet(${tweet.id})"> Retweet </button>
        <div id="${tweet.id}"></div>
        `
    }).join('')

    document.getElementById('board').innerHTML = tweetHTML;
    document.getElementById('count').innerHTML = tweets.length; // number of tweets
}

function retweet(idx) {
const getTweet = appState.tweet[idx];
console.log(getTweet)
        const retweetHTML =`   
         <h1>${getTweet.content}</h1>
        <h2>${getTweet.username}</h2>
        <p>${new Date()}</p>
        `
        document.getElementById(`${idx}`).innerHTML = retweetHTML;
}

