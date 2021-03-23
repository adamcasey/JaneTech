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

newCheckSeenTeam = (winningTeam, seenTeamsNames) => {
	return seenTeamsNames.indexOf(winningTeam) > -1
}

checkSeenTeam = (teamName, seenTeams) => {
	// console.log('checkSeenTeam winning teamName: ', teamName);
	// console.log('seenTeams: ', seenTeams);
	// if (seenTeams[teamName]) {
	if (seenTeams.hasOwnProperty(teamName)) {
		// console.log('seen this team: ', teamName);
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

	const tempTeamObj = Object.entries(teamObj).map(eachTeam => {
		// console.log('eachTeam: ', eachTeam);
		return {
			teamName: eachTeam[0],
			teamScore: eachTeam[1]
		}
	})

	return tempTeamObj.sort(function (vote1, vote2) {

	// Sort by votes
	// If the first item has a higher number, move it down
	// If the first item has a lower number, move it up
	if (vote1.teamScore > vote2.teamScore) return -1;
	if (vote1.teamScore < vote2.teamScore) return 1;

	// If the votes number is the same between both items, sort alphabetically
	// If the first item comes first in the alphabet, move it up
	// Otherwise move it down
	if (vote1.teamName > vote2.teamName) return 1;
	if (vote1.teamName < vote2.teamName) return -1;

});
	// const temp = _(tempTeamObj).chain().sortBy(function(team){
	// 	return team.teamScore;
	// }).sortBy(function(team){
	// 	return team.teamName;
	// }).value();
	// console.log('temp: ', temp);
	// console.log('tempTeamObj: ', tempTeamObj);
	// return _.fromPairs(_.sortBy(_.toPairs(teamObj), 1).reverse());
	// return _.sortBy(tempTeamObj, ['teamScore', 'teamName']).reverse();
};

handleSeenTeam = (
	winningTeam,
	losingTeam,
	seenTeams,
	scoreToAdd,
	teamArray,
	seenTeamNames
) => {
	// console.log('handling seen team: ', winningTeam);
	const prevSeenTeams = cloneDeep(seenTeams);
	const sortedSeenTeams = getSortedTeamObj(prevSeenTeams)
	teamArray.push(sortedSeenTeams);
	getNewSeenTeamsObj(seenTeams);
	seenTeamNames = [];
	// console.log('seenTeams reaassigned: ', seenTeams);
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
	newCheckSeenTeam,
	handleSeenTeam,
	handleUnseenTeam,
	getSortedTeamObj
};
