const fs = require('fs');
const readline = require('readline');
const soccerHelpers = require('./soccerHelper');

class SoccerMatches {
	constructor(inputFile, outputFile) {
		this.inputFile = inputFile;
		this.outputFile = outputFile;
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

			const readInterface = readline.createInterface({
				input: fs.createReadStream(this.fileToRead),
				crlfDelay: Infinity,
				console: false,
			});

			// for (const line of data) {
			for await (const line of readInterface) {
				try {
					if (line.length) {
						const splitTeams = soccerHelpers.getTeams(line);
						const {
							winningTeam,
							losingTeam,
							tie,
						} = soccerHelpers.getWinnerAndScore(splitTeams, this.regDigit);

						if (soccerHelpers.checkSeenTeam(winningTeam, this.seenTeams)) {
							handleSeenTeam(
								winningTeam,
								losingTeam,
								this.seenTeams,
								tie ? 1 : 3,
								this.teamArray
							);
							this.writeMatchDay()
						} else {
							handleUnseenTeam(
								winningTeam,
								losingTeam,
								tie ? 1 : 3,
								this.seenTeams
							);
						}
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
			this.writeMatchDay()

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

			console.log(`Matchday ${index + 1}`);
			// stream.write(`Matchday ${index + 1}` + '\n');
			formattedTeamObj.forEach((eachTeam) => {
				// stream.write(`${eachTeam}` + '\n');
				console.log(`${eachTeam}`);
			});
			// stream.write('\n');
			console.log('\n');
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
		// soccerMatch.writeMatchDay();
	})
	.catch((error) => console.log('error: ', error));
