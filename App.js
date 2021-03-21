// Simple Addition Function in Javascript
const fs = require('fs');
const readline = require('readline');
const soccerHelpers = require('./SoccerHelper');
// TODO: Only import lodash methods you use
const _ = require('lodash');

class SoccerMatches {
	constructor(file) {
		this.inputFile = file;
		this.teamArray = [];
		this.seenTeams = {};
		this.matchDayNum = 0;
		this.seenTeamsFlag = false;
	}

	get fileToRead() {
		return this.inputFile;
	}

	get regDigit() {
		return /\d+/;
	}

	getMatchDay = async () => {
		try {
			const readInterface = readline.createInterface({
				input: fs.createReadStream(this.fileToRead),
				crlfDelay: Infinity,
				console: false,
			});

			for await (const line of readInterface) {
				try {
					if (line.length) {
						const teamArray = soccerHelpers.getTeams(line);
						const winnerAndScore = soccerHelpers.getWinnerAndScore(
							teamArray,
							this.regDigit
						);
						if (winnerAndScore.length === 1) {
							checkSeenTeam(winnerAndScore[0], this.seenTeams)
								? // ? (this.seenTeams[winnerAndScore[0]] += 3)
								  handleSeenTeam(
										winnerAndScore[0],
										this.seenTeams,
										3,
										this.seenTeamsFlag,
										this.teamArray
								  )
								: (this.seenTeams[winnerAndScore[0]] = 3);
						} else if (winnerAndScore.length === 2) {
							checkSeenTeam(winnerAndScore[0], this.seenTeams)
								? // ? (this.seenTeams[winnerAndScore[0]] += 1)
								  handleSeenTeam(
										winnerAndScore[0],
										this.seenTeams,
										1,
										this.seenTeamsFlag,
										this.teamArray
								  )
								: (this.seenTeams[winnerAndScore[0]] = 1);
							checkSeenTeam(winnerAndScore[1], this.seenTeams)
								? // ? (this.seenTeams[winnerAndScore[1]] += 1)
								  handleSeenTeam(
										winnerAndScore[1],
										this.seenTeams,
										1,
										this.seenTeamsFlag,
										this.teamArray
								  )
								: (this.seenTeams[winnerAndScore[1]] = 1);
						} else {
							console.log('Could not determine winner');
						}
					}
				} catch (error) {
					console.log('Error getting winner: ', error);
				}
			}

			return;
		} catch (err) {
			console.log('readfile error: ', error);
		}
	};
}

const soccerMatch = new SoccerMatches(process.argv[2]);
// console.log(soccerMatch.readFile());
soccerMatch.getMatchDay().then((res) => {
	const sortedTeams = _.fromPairs(
		_.sortBy(_.toPairs(soccerMatch.seenTeams), 1).reverse()
	);
	console.log('seenTeams: ', sortedTeams);
	console.log('teamArray: ', soccerMatch.teamArray);
	// console.log('res: ', res);
	// console.log('soccerMatch: ', soccerMatch.teamArray);
});
