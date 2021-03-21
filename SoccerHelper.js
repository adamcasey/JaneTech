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
	return seenTeams[teamName];
};

handleSeenTeam = (teamName, seenTeams, scoreToAdd, seenFlag, teamArray) => {
	teamArray.push(seenTeams);
	seenTeams = {};
	seenTeams[teamName] += scoreToAdd;
	seenFlag = true;
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
