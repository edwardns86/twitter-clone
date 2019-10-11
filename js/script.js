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
                <a href ="#" onclick="searchHashtag('${word}')">${word}</a>            
            `
        }
        else
            return word;
    }).join(" ");
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
        replies: [],
        isRetweeted: false
    };
    appState.tweets.unshift(obj);
    // console.log(appState)

    renderTweet(appState.tweets);
    document.getElementById('tweet-content').value = "";
}

function renderTweet(tweets) {
    let repliesContainer =[];
    const tweetHTML = tweets.map(tweet => {
        if(tweet.replies.length > 0){
            repliesContainer.push(tweet.replies);
        }
        return `
        <h1>${isHashTag(tweet.id)}</h1>
        <h2>${tweet.username}</h2>
        <p>${moment(tweet.date).fromNow()}</p>
        <button class="btn btn-primary" onclick="retweet(${tweet.id})">Retweet</button>
        <button class="btn retweet-btn" onclick="replies(${tweet.id})">Comment</button>
        <button id="like-${tweet.id}"class="btn like-btn" onclick="like(${tweet.id})">Like</button>
        <button class="btn btn-danger" onclick="deleteTweet(${tweet.id})">Delete</button>
        <div id="retweet-${tweet.id}"></div>
        `
    }).join('');
    
    console.log(repliesContainer)

    document.getElementById('board').innerHTML = tweetHTML;
    document.getElementById('count').innerHTML = tweets.length; // number of tweets
}

function replies(a) {
    let index = appState.tweets.findIndex( tweet => tweet.id === a);
    const getTweet = appState.tweets[index];
    let promtInput = prompt("enter your message")
    const obj = {
        name: promtInput
    }
    console.log(getTweet)
    const retweetHTML = `   
        <h1>Retweet with love by ${promtInput}</h1>
        <h6>${getTweet.content}</h6>
        <h2>${getTweet.username}</h2>
        <p>${moment(new Date()).fromNow()}</p>
       

        `
    document.getElementById(`retweet-${a}`).innerHTML = retweetHTML;
    appState.tweets[index].replies.push(obj)
}

function retweet(a) {
    const currTweet = appState.tweets.filter( tweet => tweet.id === a);
    currTweet[0].isRetweeted = true;
    const whyYouShare = prompt("Why you share ?");
    let obj = {
        id: id++,
        username: "anonymous",
        content:  `${whyYouShare} ` +currTweet[0].content,
        hashtags: [],
        date: new Date(),
        liked: false,
        replies: [],
        parentID: currTweet[0].id,
        isRetweeted: false
    };
console.log("tweet Obj", obj)
    appState.tweets.unshift(obj);
    renderTweet(appState.tweets)

}

function like(a) {
    let index = appState.tweets.findIndex( tweet => tweet.id === a);
    const getTweet = appState.tweets[index];
    getTweet.liked = !getTweet.liked;
    console.log(getTweet.liked)
    getTweet.liked ? document.getElementById(`like-${a}`).innerHTML = 'Like' : document.getElementById(`like-${a}`).innerHTML = 'Unlike';
}

function deleteTweet(a) {
    let index = appState.tweets.findIndex( tweet => tweet.id === a);
    appState.tweets.splice(index, 1)
    renderTweet(appState.tweets);
}

function searchHashtag(selectedHashTag) {
    const result = appState.tweets.filter(tweet => {
        if (tweet.hashtags.includes(selectedHashTag))
        return tweet;
    })
    console.log('test ',result);

    renderTweet(result)
}