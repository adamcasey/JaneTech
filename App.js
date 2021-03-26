// Simple Addition Function in Javascript
const fs = require('fs');
const readline = require('readline');
const soccerHelpers = require('./soccerHelper');

class SoccerMatches {
	constructor(inputFile, outputFile) {
		this.inputFile = inputFile;
		this.outputFile = outputFile
		this.teamArray = [];
		this.seenTeams = {};
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

						soccerHelpers.checkSeenTeam(winningTeam, this.seenTeams)
							? handleSeenTeam(
									winningTeam,
									losingTeam,
									this.seenTeams,
									tie ? 1 : 3,
									this.teamArray,
							  )
							: handleUnseenTeam(
									winningTeam,
									losingTeam,
									tie ? 1 : 3,
									this.seenTeams
							  );
					}
				} catch (error) {
					console.log('Error getting winner: ', error);
				}
			}
			// End of data so push last object to teamArray
			// Need to get previous scores for final team
			getPreviousScores(this.seenTeams, this.teamArray);
			const sortedFinalTeam = getSortedTeamObj(this.seenTeams);
			this.teamArray.push(sortedFinalTeam);

			return 1;
		} catch (err) {
			console.log('readfile error: ', error);
		}
	};

	writeMatchDay = () => {

		const stream = fs.createWriteStream(this.outputFile, { flags: 'a' });

		const numTeamsToShow = getNumTeamsToShow(this.teamArray);

		this.teamArray.forEach((eachMatchObj, index) => {
			const teamSubArray = eachMatchObj.slice(0, numTeamsToShow + 1);
			const formattedTeamObj = getFormattedTeamObj(teamSubArray);

			stream.write(`Matchday ${index + 1}` + '\n');
			formattedTeamObj.forEach((eachTeam) => {
				stream.write(`${eachTeam}` + '\n');
			});
			stream.write('\n');
		});

		console.log('Done writing to file');
		stream.end();
	};
}

const soccerMatch = new SoccerMatches(process.argv[2], process.argv[3]);
soccerMatch
	.getMatchDay()
	.then((res) => {
		// console.log('teamArray: ', soccerMatch.teamArray);
		// console.log('total matches: ', soccerMatch.teamArray.length);
		// console.log('seenNames: ', soccerMatch.seenTeamsNames);
		soccerMatch.writeMatchDay();
	})
	.catch((error) => console.log('error: ', error));
