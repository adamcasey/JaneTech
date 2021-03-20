// Simple Addition Function in Javascript
const fs = require('fs');
const readline = require('readline');

class SoccerMatches {
	constructor(file) {
		this.inputFile = file;
		this.teamArray = [];
	}

	get thisInstance() {
		return this;
	}

	get fileToRead() {
		return this.inputFile;
	}

	getScore = (line) => {
		return parseInt(line);
	};

	getTeams = (line) => {
		return line.split(',');
	};

	readFile = async () => {
		const readInterface = readline.createInterface({
			input: fs.createReadStream(this.fileToRead),
			// output: process.stdout,
			crlfDelay: Infinity,
			console: false,
		});

		// const thisTemp = this.thisInstance;

		const matchArray = [];

		const r = /\d+/;

		for await (const line of readInterface) {
			if (line.length) {
				const teamArray = this.getTeams(line);
				const firstScore = teamArray[0].match(r);
				// console.log('first team: ', teamArray[0]);
				if (firstScore) {
					console.log('firstScore: ', firstScore[0]);
					matchArray.push(teamArray);
					this.teamArray.push(teamArray);
				}
			}
		}

		// readInterface.on('line', (line) => {
		// 	// Avoid emptylines
		// 	if (line.length) {
		// 		const teamArray = thisTemp.getTeams(line);
		// 		matchArray.push(teamArray);
		// 		thisTemp.teamArray.push(teamArray);
		// 		// console.log('thisTemp.teamArray: ', thisTemp.teamArray);
		// 		// console.log('teamArray: ', teamArray);
		// 	}
		// });

		return matchArray;
	};
}

const soccerMatch = new SoccerMatches(process.argv[2]);
// console.log(soccerMatch.readFile());
soccerMatch.readFile().then((res) => {
	console.log('res: ', res);
});
