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
			// const readInterface = readline.createInterface({
			// 	input: fs.createReadStream(this.fileToRead),
			// 	crlfDelay: Infinity,
			// 	console: false,
			// });
			const data = fs
				.readFileSync(this.fileToRead, {
					encoding: 'utf8',
					flag: 'r',
				})
				.split('\n');
			console.log('data: ', data);
			// for (const line of data) {
			// 	console.log('line: ', line);
			// }
			// return;

			// for await (const line of data) {
			for (const line of data) {
				try {
					if (line.length) {
						const splitTeams = soccerHelpers.getTeams(line);
						const {
							winningTeam,
							losingTeam,
							tie,
						} = soccerHelpers.getWinnerAndScore(splitTeams, this.regDigit);

						checkSeenTeam(winningTeam, this.seenTeams)
							? handleSeenTeam(
									winningTeam,
									losingTeam,
									this.seenTeams,
									tie ? 1 : 3,
									this.teamArray
							  )
							: handleUnseenTeam(
									winningTeam,
									losingTeam,
									tie ? 1 : 3,
									this.seenTeams
							  );

						const teamExistsInArray = this.seenTeamsNames.indexOf(winningTeam);
						teamExistsInArray > -1
							? null
							: this.seenTeamsNames.push(winningTeam);
					}
				} catch (error) {
					console.log('Error getting winner: ', error);
				}
				console.log('seenTeams in loop: ', this.seenTeams);
			}
			// End of data so push last object to teamArray
			this.teamArray.push(this.seenTeams);

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
	// console.log('sorted teams: ', sortedTeams);
	console.log('teamArray: ', soccerMatch.teamArray);
	console.log('seenNames: ', soccerMatch.seenTeamsNames);
});
