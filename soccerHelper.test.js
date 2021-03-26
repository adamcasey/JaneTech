const soccerHelper = require('./soccerHelper');

test('finds seen team name in object of seen teams', () => {
	expect(
		soccerHelper.checkSeenTeam('San Jose Earthquakes', {
			'San Jose Earthquakes': '2',
			'Monterey United': '0',
		})
	).toBeTruthy();
	expect(
		soccerHelper.checkSeenTeam('Aptos FC', {
			'San Jose Earthquakes': '2',
			'Monterey United': '0',
		})
	).toBeFalsy();
});

test('gets correct number of top teams to write', () => {
	expect(
		soccerHelper.getNumTeamsToShow([
			'team 1',
			'team 2',
			'team 3',
			'team 4',
			'team 5',
			'team 6',
		])
	).toBe(3);
	expect(
		soccerHelper.getNumTeamsToShow([
			'team 1',
			'team 2',
			'team 3',
			'team 4',
			'team 5',
			'team 6',
			'team 7',
			'team 8',
		])
	).toBe(4);
});

test('gets team name', () => {
	const teamNameOne = soccerHelper.getTeamName('Capitola Seahorses 1');
	expect('Capitola Seahorses').toEqual(expect.stringContaining(teamNameOne));
	const teamNameTwo = soccerHelper.getTeamName(' 1');
	expect('').toEqual(expect.stringContaining(teamNameTwo));
});

test('gets both teams', () => {
	expect(
		soccerHelper.getTeams('Capitola Seahorses 5, San Jose Earthquakes 5')
	).toHaveLength(2);
	expect(
		soccerHelper.getTeams('Felton Lumberjacks 1 San Jose Earthquakes 5')
	).toBeNull();
});

test('gets sorted teams', () => {
	const sortedMatchOne = soccerHelper.getSortedTeamObj({
		'Aptos FC': 3,
		'Felton Lumberjacks': 1,
	});
	expect(sortedMatchOne[0]).toContain('Aptos FC');
	expect(sortedMatchOne[1]).toContain('Felton Lumberjacks');
	const sortedMatchTwo = soccerHelper.getSortedTeamObj({
		'San Jose Earthquakes': 3,
		'Santa Cruz Slugs': 3,
	});
	expect(sortedMatchTwo[0]).toContain('San Jose Earthquakes');
	expect(sortedMatchTwo[1]).toContain('Santa Cruz Slugs');
});

test('gets winner, loser, and score for a match', () => {
	const reqDigit = /\d+/;
	const getTieResponse = soccerHelper.getWinnerAndScore(
		['San Jose Earthquakes 3', 'Santa Cruz Slugs 3'],
		reqDigit
	);
	expect(getTieResponse).toHaveProperty('winningTeam');
	expect(getTieResponse).toHaveProperty('losingTeam');
	expect(getTieResponse.tie).toBeTruthy();

	const getWinnerResponse = soccerHelper.getWinnerAndScore(
		['San Jose Earthquakes 3', 'Aptos FC 2'],
		reqDigit
	);
	expect(getWinnerResponse).toHaveProperty('winningTeam');
	expect(getWinnerResponse.winningTeam).toBe('San Jose Earthquakes');
	expect(getWinnerResponse).toHaveProperty('losingTeam');
	expect(getWinnerResponse.losingTeam).toBe('Aptos FC');
	expect(getWinnerResponse.tie).toBeFalsy();
});
