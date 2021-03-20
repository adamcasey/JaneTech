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

		for await (const line of readInterface) {
			const teamArray = this.getTeams(line);
			matchArray.push(teamArray);
			this.teamArray.push(teamArray);
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
