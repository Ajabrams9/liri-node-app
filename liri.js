require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var fs = require("fs");

const moment = require('node-moment');

var date = new Date(2010, 0, 14);
var wrapped = moment(date);
console.log(wrapped.format('"MM/DD/YYYY"'));


let operator = process.argv[2];

switch (operator) {
    case "concert-this":
        let artist = "";
        for (i = 3; i < process.argv.length; i++) {
            artist += process.argv[i] + "";
            console.log(artist);
        }
        concertThis(artist);
        break;

    case "spotify-this-song":

        let songName = "";
        for (i = 3; i < process.argv.length; i++) {
            songName += process.argv[i] + "";
            console.log(songName);
        }

        if (songName == "") {
            console.log("empty")
            spotifyThisSong("the+sign");
        } else {
            spotifyThisSong(songName);
        }

        break;

    case "movie-this":
        let movieName = "";
        for (i = 3; i < process.argv.length; i++) {
            movieName += process.argv[i] + "";
            console.log(movieName);
        }

        if (movieName == "") {
            console.log("empty")
            movieThis("mr+nobody");
        } else {
            movieThis(movieName);
        }
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;
}


function logStuff(data) {

    var logFile = './log.txt';
    var log = require("simple-node-logger").createSimpleFileLogger(logFile);

    log.setLevel("all");

    // var dataArr = data.split(",");
    data.forEach(x => console.log(x));
    log.info(`${operator} ${data}`);

}




function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        // console.log(data);

        // // Then split it by commas (to make it more readable)
        var dataArray = data.split(",");
        // console.log(dataArray);

        // dataArray.forEach(x => console.log(x));

        spotifyThisSong(dataArray[1]);
    });
}





function spotifyThisSong(songInput) {


    spotify.search({
        type: 'track',
        query: songInput
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var musicArray = [];

        var song = data.tracks.items[0].name;
        var artist = data.tracks.items[0].album.artists[0].name;
        var url = data.tracks.items[0].album.artists[0].external_urls.spotify;
        var albumName = data.tracks.items[0].album.name;

        musicArray.push(song, artist, url, albumName);
        logStuff(musicArray);

    });


}



function concertThis(artist) {

    var request = require("request");

    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {



        if (!error && response.statusCode === 200) {

            let theBody = JSON.parse(body);


            for (i = 0; i < theBody.length; i++) {

                var name = theBody[i].venue["name"];
                var city = theBody[i].venue["city"];
                var dateTime = theBody[i].datetime;
                var formattedDate = moment(dateTime).format('"MM/DD/YYYY"');

                console.log(name);
                console.log(city);
                console.log(formattedDate);


            }

        }


    });

}










function movieThis(movieName) {
    var request = require("request");

    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        // console.log(response);

        if (!error && response.statusCode === 200) {
            console.log(JSON.parse(body));
            console.log("The movie's title is: " + JSON.parse(body).Title);
            console.log("The movie's year is: " + JSON.parse(body).Year);
            console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
            console.log("The movie's Rotten Tomatoes Rating is: " + JSON.parse(body).Ratings[1].Value);
            console.log("The movie's country is: " + JSON.parse(body).Country);
            console.log("The movie's language is: " + JSON.parse(body).Language);
            console.log("The movie's plot is: " + JSON.parse(body).Plot);
            console.log("The movie's actors are: " + JSON.parse(body).Actors);
        }
    });
}