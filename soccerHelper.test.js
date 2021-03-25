const soccerHelper = require('./soccerHelper');

test('finds seen team name in object of seen teams', () => {
	expect(
		soccerHelper.checkSeenTeam('adam', { 'adam': 'casey', 'runs': 'a lot' })
	).toBe(true);
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
	const teamName = soccerHelper.getTeamName('Capitola Seahorses 1');
	expect('Capitola Seahorses').toEqual(expect.stringContaining(teamName));
});

test('gets both teams', () => {
  expect(soccerHelper.getTeams('Capitola Seahorses 5, San Jose Earthquakes 5')).toHaveLength(2);
  expect(soccerHelper.getTeams('Felton Lumberjacks 1 San Jose Earthquakes 5')).toBeNull();
})

test('returns score for a team', () => {
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
