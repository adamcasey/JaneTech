// Simple Addition Function in Javascript
const fs = require('fs');
const readline = require('readline');
const soccerHelpers = require('./SoccerHelper');
// TODO: Only import lodash methods you use

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
			const data = fs
				.readFileSync(this.fileToRead, {
					encoding: 'utf8',
					flag: 'r',
				})
				.split('\n');

			for (const line of data) {
				try {
					if (line.length) {
						const splitTeams = soccerHelpers.getTeams(line);
						const {
							winningTeam,
							losingTeam,
							tie,
						} = soccerHelpers.getWinnerAndScore(splitTeams, this.regDigit);
						// console.log('seenTeamNamess beginning of loop: ', this.seenTeamsNames);
						// console.log('new checkSeenTeam: ', soccerHelpers.newCheckSeenTeam(winningTeam, this.seenTeamsNames));
						// console.log('seenTeams beginning of loop: ', this.seenTeams);
						// console.log('old checkSeenTeam: ', soccerHelpers.checkSeenTeam(winningTeam, this.seenTeams));

						soccerHelpers.checkSeenTeam(winningTeam, this.seenTeams)
							? handleSeenTeam(
									winningTeam,
									losingTeam,
									this.seenTeams,
									tie ? 1 : 3,
									this.teamArray,
									this.seenTeamsNames
							  )
							: handleUnseenTeam(
									winningTeam,
									losingTeam,
									tie ? 1 : 3,
									this.seenTeams
							  );

						// const winningTeamExistsInArray = this.seenTeamsNames.indexOf(
						// 	winningTeam
						// );
						// winningTeamExistsInArray > -1
						// 	? null
						// 	: this.seenTeamsNames.push(winningTeam);

						// const losingTeamExistsInArray = this.seenTeamsNames.indexOf(
						// 	losingTeam
						// );
						// losingTeamExistsInArray > -1
						// 	? null
						// 	: this.seenTeamsNames.push(losingTeam);
					}
					// console.log('seenTeams in loop: ', this.seenTeams);
				} catch (error) {
					console.log('Error getting winner: ', error);
				}
			}
			// End of data so push last object to teamArray
			const sortedFinalTeam = getSortedTeamObj(this.seenTeams)
			this.teamArray.push(sortedFinalTeam);

			return;
		} catch (err) {
			console.log('readfile error: ', error);
		}
	};
}

const soccerMatch = new SoccerMatches(process.argv[2]);
// console.log(soccerMatch.readFile());
soccerMatch.getMatchDay().then((res) => {
	// console.log('sorted teams: ', sortedTeams);
	console.log('teamArray: ', soccerMatch.teamArray);
	// console.log('seenNames: ', soccerMatch.seenTeamsNames);
});
