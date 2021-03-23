const cloneDeep = require('lodash/cloneDeep');

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
	if (seenTeams.hasOwnProperty(teamName)) {
		return true;
	}
	return false;
};

getNewSeenTeamsObj = (seenTeams) => {
	for (const prop of Object.getOwnPropertyNames(seenTeams)) {
		delete seenTeams[prop];
	}
};

getSortedTeamObj = (teamObj) => {
	const tempTeamObj = Object.entries(teamObj).map((eachTeam) => {
		return {
			teamName: eachTeam[0],
			teamScore: eachTeam[1],
		};
	});

	return tempTeamObj.sort(function (vote1, vote2) {
		// Sort by score
		if (vote1.teamScore > vote2.teamScore) return -1;
		if (vote1.teamScore < vote2.teamScore) return 1;

		// If the score is the same between both teams, sort alphabetically
		if (vote1.teamName > vote2.teamName) return 1;
		if (vote1.teamName < vote2.teamName) return -1;
	});
};

// Modifies the seenClone obj by reference so no need to clone again
getPreviousScores = (seenClone, teamArray) => {
	// No previous scores to accrue
	if (teamArray.length < 1) return seenClone;

	return teamArray[teamArray.length - 1].forEach((prevTeam) => {
		// const currentScore = seenClone[prevTeam.teamName];
		seenClone[prevTeam.teamName] += prevTeam.teamScore;
	});
};

handleSeenTeam = (
	winningTeam,
	losingTeam,
	seenTeams,
	scoreToAdd,
	teamArray,
	seenTeamNames
) => {

	const seenTeamsClone = cloneDeep(seenTeams);

	getPreviousScores(seenTeamsClone, teamArray);
	
	const sortedSeenTeams = getSortedTeamObj(seenTeamsClone);
	teamArray.push(sortedSeenTeams);
	getNewSeenTeamsObj(seenTeams);
	seenTeamNames = [];
	
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

module.exports = {
	getScore,
	getTeams,
	getTeamName,
	getWinnerAndScore,
	checkSeenTeam,
	handleSeenTeam,
	handleUnseenTeam,
	getSortedTeamObj,
	getPreviousScores
};
