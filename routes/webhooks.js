let express = require('express');
let router = express.Router();
let request = require('request');

// GET home page
router.post('/', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	movieRecommendationByGener(req, res);
});

function movieRecommendationByGener(req, mainResponse) {
	// Création de l'URL
	let options = {
		'uri': generateMovieGenerReq(getGenreId(req)),
		'method': 'GET'
	};

	let resFromMovieDb = '';
	let movie;

	request(options, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			resFromMovieDb = JSON.parse(body);
			//Getting movie object from the result
			movie = resFromMovieDb['results'][0];

			// Creating facebook generic template
			let facebookTemplate = {
				facebook: {
					attachment : {
						type: 'template',
						payload: {
							template_type: 'generic',
							elements: [{
								title: movie['title'],
								item_url: 'https://petersfancybrownhats.com',
								image_url: 'https://image.tmdb.org/t/p/w500' + movie['poster_path'],
								subtitles: 'rating :' + movie['vote_average'],
								buttons: [{
									type: 'web_url',
									url: 'https://petersfancybrownhats.com',
									titel: 'View Website'
								}]
							}]
						}
					}
				}
			}

			let response = {
				speech: 'Here are some movies from api that I think you might like',
				displayText: 'Here are some movies from api that I think you might like',
				data: facebookTemplate,
				source: 'apiai-weather-webhook-sample'
			};

			// responding with the final response
			mainResponse.send(response);
		} else {
			// handle if error
			res = 'Not Found';
		}
	});

	function getGenreId(req) {
		// Retrive the Parameters from API.ai agent and return the gener Id according to the request.
		var result = req.body["result"];
		var parameter = result["parameters"];
		var obtainedGener = parameter["movie-gener"];

		switch (obtainedGener) {
			case "Action":
				return 28;

			case "Horror":
				return 27;

			case "Adventure":
				return 12;

			case "Animation":
				return 16;

			case "Comedy":
				return 35;

			case "Crime":
				return 80;

			case "Documentary":
				return 99;

			case "Drama":
				return 18;

			case "Family":
				return 10751;

			case "Fantasy":
				return 14;

			case "History":
				return 36;

			case "Music":
				return 10402;

			case "Mystery":
				return 9648;

			case "Romance":
				return 10749;

			case "Science Fiction":
				return 878;

			case "Thriller":
				return 53;

			case "War":
				return 10752;

			case "Western":
				return 37;

			default:
				return 18;    
		}
	}

	function generateMovieGenerReq(generId) {
		return 'https://api.themoviedb.org/3/genre/' + generId + '/movies?api_key=9f152fa2b443b453e0ddb2405b314216&language=en-US&include_adult=false&sort_by=created_at.asc'
	}
}

module.exports = router;