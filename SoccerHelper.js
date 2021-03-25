const cloneDeep = require('lodash/cloneDeep');

getScore = (line) => {
	return parseInt(line);
};

getTeams = (line) => {
	if (line.indexOf(',') > -1)
		return line.split(',');
	return null
};

getTeamName = (team) => {
	return team.replace(/\d+/g, '').trim();
};

getNumTeamsToShow = (teamArray) => {
	return teamArray.length / 2;
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
	return null;
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
	const tempTeamArray = Object.entries(teamObj).map((eachTeam) => {
		return [eachTeam[0], eachTeam[1]];
	});

	return tempTeamArray.sort(function (vote1, vote2) {
		// Sort by score
		if (vote1[1] > vote2[1]) return -1;
		if (vote1[1] < vote2[1]) return 1;

		// If the score is the same between both teams, sort alphabetically
		if (vote1[0] > vote2[0]) return 1;
		if (vote1[0] < vote2[0]) return -1;
	});
};

// Modifies the seenClone obj by reference so no need to clone again
getPreviousScores = (seenClone, teamArray) => {
	// No previous scores to accrue
	if (teamArray.length < 1) return seenClone;

	return teamArray[teamArray.length - 1].forEach((prevTeam) => {
		seenClone[prevTeam[0]] += prevTeam[1];
	});
};

handleSeenTeam = (
	winningTeam,
	losingTeam,
	seenTeams,
	scoreToAdd,
	teamArray
) => {
	const seenTeamsClone = cloneDeep(seenTeams);

	getPreviousScores(seenTeamsClone, teamArray);

	const sortedSeenTeams = getSortedTeamObj(seenTeamsClone);
	teamArray.push(sortedSeenTeams);
	getNewSeenTeamsObj(seenTeams);

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

/*
teamSubArray:  [
  [ 'Aptos FC', 6 ],
  [ 'Felton Lumberjacks', 6 ],
  [ 'Monterey United', 6 ]
]
*/
getFormattedTeamObj = (teamSubArray) => {
	const formattedTeams = teamSubArray.map((eachTeamArray) => {
		return `${eachTeamArray[0]}, ${eachTeamArray[1]} pts `;
	});

	return formattedTeams;
};

function sum(a, b) {
	return a + b;
}

module.exports = {
	sum,
	getScore,
	getTeams,
	getTeamName,
	getWinnerAndScore,
	checkSeenTeam,
	handleSeenTeam,
	handleUnseenTeam,
	getSortedTeamObj,
	getPreviousScores,
	getNumTeamsToShow,
	getFormattedTeamObj,
};
