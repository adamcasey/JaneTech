// Simple Addition Function in Javascript
const fs = require('fs');
const readline = require('readline');
const soccerHelpers = require('./SoccerHelper');

class SoccerMatches {
	constructor(file) {
		this.inputFile = file;
		this.teamArray = [];
	}

	get fileToRead() {
		return this.inputFile;
	}

	get regDigit() {
		return /\d+/;
	}

	getScore = (line) => {
		return parseInt(line);
	};

	getTeams = (line) => {
		return line.split(',');
	};

	getTeamName = (team) => {
		return team.replace(/\d+/g, '').trim();
	};

	getWinnerAndScore = (teamArray) => {
		const firstScore = teamArray[0].match(this.regDigit);
		const secondScore = teamArray[1].match(this.regDigit);
		let teamName = '';
		if (firstScore > secondScore) {
			teamName = this.getTeamName(teamArray[0]);
			return [teamName, firstScore[0]];
		}
		if (secondScore > firstScore) {
			teamName = this.getTeamName(teamArray[1]);
			return [teamName, secondScore[0]];
		}
		if (firstScore === secondScore) return;
	};

	readFile = async () => {
		try {
			// console.log('soccerHelp: ', soccerHelpers.add(4, 4));
			const readInterface = readline.createInterface({
				input: fs.createReadStream(this.fileToRead),
				crlfDelay: Infinity,
				console: false,
			});

			for await (const line of readInterface) {
				try {
					if (line.length) {
						const teamArray = this.getTeams(line);
						const winnerAndScore = this.getWinnerAndScore(teamArray);
						if (winnerAndScore) {
							console.log('winnder is: ', winnerAndScore);
						} else {
							console.log('tie between: ', teamArray[0], ' and ', teamArray[1]);
						}

						// console.log('first team: ', teamArray[0]);
						// if (firstScore && secondScore) {
						// 	console.log('firstScore: ', firstScore[0]);
						// 	console.log('secondScore: ', secondScore[0]);
						// 	this.teamArray.push(teamArray);
						// }
					}
				} catch (error) {
					console.log('Error getting winner: ', error);
				}
			}
			// }

			// return matchArray;
			return this.teamArray;
		} catch (err) {
			console.log('readfile error: ', error);
		}
	};
}

const soccerMatch = new SoccerMatches(process.argv[2]);
// console.log(soccerMatch.readFile());
soccerMatch.readFile().then((res) => {
	// console.log('res: ', res);
	// console.log('soccerMatch: ', soccerMatch.teamArray);
});
