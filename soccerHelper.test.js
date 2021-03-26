const soccerHelper = require('./soccerHelper');

test('finds seen team name in object of seen teams', () => {
  expect(soccerHelper.checkSeenTeam("adam", {"adam": "casey", "runs": "a lot"})).toBe(true)
});

test('gets correct number of top teams to write', () => {
  expect(soccerHelper.getNumTeamsToShow(["team 1", "team 2", "team 3", "team 4", "team 5", "team 6"])).toBe(3)
});
