const cloneDeep = require('lodash/cloneDeep');
const _ = require('lodash');

getScore = (line) => {
	return parseInt(line);
};

getTeams = (line) => {
	return line.split(',');
};

getTeamName = (team) => {
	return team.replace(/\d+/g, '').trim();
};

getWinnerAndScore = (teamArray, regDigit) => {
	const firstScoreArray = teamArray[0].match(regDigit);
	const secondScoreArray = teamArray[1].match(regDigit);
	const firstScoreNum = parseInt(firstScoreArray[0]);
	const secondScoreNum = parseInt(secondScoreArray[0]);
	let winningTeam = '';
	let losingTeam = '';

	if (firstScoreNum > secondScoreNum) {
		winningTeam = getTeamName(teamArray[0]);
		losingTeam = getTeamName(teamArray[1]);
		return { winningTeam: winningTeam, losingTeam: losingTeam, tie: false };
	}
	if (secondScoreNum > firstScoreNum) {
		winningTeam = getTeamName(teamArray[1]);
		losingTeam = getTeamName(teamArray[0]);
		return { winningTeam: winningTeam, losingTeam: losingTeam, tie: false };
	}
	if (firstScoreNum === secondScoreNum) {
		const firstTeamName = getTeamName(teamArray[0]);
		const secondTeamName = getTeamName(teamArray[1]);

		return {
			winningTeam: firstTeamName,
			losingTeam: secondTeamName,
			tie: true,
		};
	}
};

checkSeenTeam = (teamName, seenTeams) => {
	console.log('checkSeenTeam winning teamName: ', teamName);
	console.log('seenTeams: ', seenTeams);
	// if (seenTeams[teamName]) {
	if (seenTeams.hasOwnProperty(teamName)) {
		console.log('seen this team: ', teamName);
		return true;
	}
	return false;
};

getNewSeenTeamsObj = (seenTeams) => {
	for (const prop of Object.getOwnPropertyNames(seenTeams)) {
		delete seenTeams[prop];
	}
};

handleSeenTeam = (
	winningTeam,
	losingTeam,
	seenTeams,
	scoreToAdd,
	teamArray
) => {
	console.log('handling seen team: ', winningTeam);
	const prevSeenTeams = cloneDeep(seenTeams);
	const sortedSeenTeams = _.fromPairs(
		_.sortBy(_.toPairs(prevSeenTeams), 1).reverse()
	);
	teamArray.push(sortedSeenTeams);
	getNewSeenTeamsObj(seenTeams);
	console.log('seenTeams reaassigned: ', seenTeams);
	if (scoreToAdd === 3) {
		seenTeams[winningTeam] = 3;
		seenTeams[losingTeam] = 0;
	} else if (scoreToAdd === 1) {
		seenTeams[winningTeam] = 1;
		seenTeams[losingTeam] = 1;
	}
	return seenTeams;
};

handleUnseenTeam = (winningTeam, losingTeam, scoreToAdd, seenTeams) => {
	if (scoreToAdd === 3) {
		seenTeams[winningTeam] = 3;
		seenTeams[losingTeam] = 0;
	} else if (scoreToAdd === 1) {
		seenTeams[winningTeam] = 1;
		seenTeams[losingTeam] = 1;
	}

	return seenTeams;
};

// module.exports = { add, subtract, num, getScore, getTeams, getTeamName };
module.exports = {
	getScore,
	getTeams,
	getTeamName,
	getWinnerAndScore,
	checkSeenTeam,
	handleSeenTeam,
	handleUnseenTeam,
};
