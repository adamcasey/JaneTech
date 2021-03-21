const cloneDeeo = require('lodash/cloneDeep');

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
	let teamName = '';
	if (firstScoreNum > secondScoreNum) {
		teamName = getTeamName(teamArray[0]);
		return [teamName];
	}
	if (secondScoreNum > firstScoreNum) {
		teamName = getTeamName(teamArray[1]);
		return [teamName];
	}
	if (firstScoreNum === secondScoreNum) {
		const firstTeamName = getTeamName(teamArray[0]);
		const secondTeamName = getTeamName(teamArray[1]);

		return [firstTeamName, secondTeamName];
	}
};

checkSeenTeam = (teamName, seenTeams) => {
	console.log('checkSeenTeam teamName: ', teamName);
	console.log('seenTeams: ', seenTeams);
	if (seenTeams[teamName]) {
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
	// console.log('handling seen team: ', teamArray);
	const prevSeenTeams = cloneDeeo(seenTeams);
	teamArray.push(prevSeenTeams);
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
