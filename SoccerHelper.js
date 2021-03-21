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
	console.log('teamName: ', teamName);
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

handleSeenTeam = (teamName, seenTeams, scoreToAdd, seenNames, teamArray) => {
	console.log('handling seen team: ', teamArray);
	teamArray.push(seenTeams);
	getNewSeenTeamsObj(seenTeams);
	console.log('seenTeams reaassigned: ', seenTeams);
	seenTeams[teamName] = scoreToAdd;
	seenNames.push(teamName);
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
};
