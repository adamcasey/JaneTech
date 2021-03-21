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
		this.seenTeamsNames = [];
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
						const splitTeams = soccerHelpers.getTeams(line);
						const winnerAndScore = soccerHelpers.getWinnerAndScore(
							splitTeams,
							this.regDigit
						);
						if (winnerAndScore.length === 1) {
							checkSeenTeam(winnerAndScore[0], this.seenTeams)
								? handleSeenTeam(
										winnerAndScore[0],
										soccerHelpers.getTeamName(splitTeams[1]),
										this.seenTeams,
										3,
										this.teamArray
								  )
								: handleUnseenTeam(
										winnerAndScore[0],
										soccerHelpers.getTeamName(splitTeams[1]),
										3,
										this.seenTeams
								  );

							const teamExistsInArray = this.seenTeamsNames.indexOf(
								winnerAndScore[0]
							);
							teamExistsInArray > -1
								? null
								: this.seenTeamsNames.push(winnerAndScore[0]);
						} else if (winnerAndScore.length === 2) {
							const sortedTie = winnerAndScore.sort();
							console.log('sortedTie: ', sortedTie);
							checkSeenTeam(sortedTie[0], this.seenTeams)
								? handleSeenTeam(
										sortedTie[0],
										sortedTie[1],
										this.seenTeams,
										3,
										this.teamArray
								  )
								: handleUnseenTeam(
										sortedTie[0],
										sortedTie[1],
										1,
										this.seenTeams
								  );
							// let teamExistsInArray = this.seenTeamsNames.indexOf(sortedTie[0]);
							// teamExistsInArray > -1
							// 	? null
							// 	: this.seenTeamsNames.push(sortedTie[0]);
							// checkSeenTeam(sortedTie[1], this.seenTeams)
							// 	? // ? (this.seenTeams[winnerAndScore[1]] += 1)
							// 	  handleSeenTeam(
							// 			sortedTie[1],
							// 			this.seenTeams,
							// 			1,
							// 			this.seenTeamsNames,
							// 			this.teamArray
							// 	  )
							// 	: (this.seenTeams[sortedTie[1]] = 1);
							// teamExistsInArray = this.seenTeamsNames.indexOf(sortedTie[1]);
							// teamExistsInArray > -1
							// 	? null
							// 	: this.seenTeamsNames.push(sortedTie[1]);
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
	// console.log('seenTeams: ', sortedTeams);
	console.log('teamArray: ', soccerMatch.teamArray);
	// console.log('seenNames: ', soccerMatch.seenTeamsNames);
});
