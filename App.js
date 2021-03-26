const fs = require('fs');
const readline = require('readline');
const soccerHelpers = require('./soccerHelper');

class SoccerMatches {
	constructor(inputFile) {
		this.inputFile = inputFile;
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

			const readInterface = readline.createInterface({
				input: fs.createReadStream(this.fileToRead),
				crlfDelay: Infinity,
				console: false,
			});

			for await (const line of readInterface) {
				try {
					if (line.length) {
						const splitTeams = soccerHelpers.getTeams(line);
						if (!splitTeams) {
							console.log('Could not determine teams');
							return;
						}
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
			this.writeMatchDay();

			return 1;
		} catch (err) {
			console.log('readfile error: ', error);
		}
	};

	writeMatchDay = () => {
		const numTeamsToShow = getNumTeamsToShow(this.teamArray);

		this.teamArray.forEach((eachMatchObj, index) => {
			const teamSubArray = eachMatchObj.slice(0, numTeamsToShow + 1);
			const formattedTeamObj = getFormattedTeamObj(teamSubArray);

			console.log(`Matchday ${index + 1}`);
			formattedTeamObj.forEach((eachTeam) => {
				console.log(`${eachTeam}`);
			});
			console.log('\n');
		});
	};
}

try {

	if (!fs.existsSync(process.argv[2])) return console.log('Missing input file');

	const inputFile = process.argv[2];

	const soccerMatch = new SoccerMatches(inputFile);
	soccerMatch
		.getMatchDay()
		.then((res) => {
			// Do nothing
		})
		.catch((error) => console.log('error: ', error));
} catch (error) {
	console.log('Error: ', error);
}
