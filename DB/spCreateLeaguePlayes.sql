DELIMITER $$
DROP PROCEDURE IF EXISTS spCreateLeaguePlayers;
CREATE PROCEDURE spCreateLeaguePlayers(IN targetLeagueId integer, IN maxPlayerWorth integer)
BEGIN

DECLARE startDate datetime;
DECLARE maxPlayerGrade double;

# the league start Date is current date
SELECT currentDate
into startDate  
FROM gamedates limit 1;

#insert players into the league with their stats from all games prior start date
INSERT INTO players (player, playerId,avgRebounds,avgAssists,avgSteals,avgBlocks,avgTurnovers,avgPoints,leagueId,createdAt,updatedAt) 
	SELECT player, playerId, avg(rebound), avg(assists), avg(steals), avg(block), avg(turnover), avg(points), targetLeagueId, CURDATE(), CURDATE() 
    FROM nba_raw_data 
    where gameDate <= startDate 
    group by player,playerId;

#set players grade
update players, 
		(select playerId, sum(rebound+assists+steals+block-turnover+1.1*points) as grade 
		from nba_raw_data 
		where gameDate < startDate
		group by playerId) as stats 
set players.grade = stats.grade 
where players.playerId = stats.playerId 
and players.leagueId = targetLeagueId;   

#find max grade
SELECT max(grade)
into maxPlayerGrade
from players                                
where leagueId = targetLeagueId;

#set players worth
#max grade gets max worth. All the rest are worth relative to the max grade
update players 
set worth = grade*maxPlayerWorth/maxPlayerGrade
where leagueId = targetLeagueId;

#set 100 players to worth 0, so teams ith no budget can complete the team with 10 players
update players 
set worth = 0
where leagueId = targetLeagueId
order by grade asc
limit 100;

END$$

DELIMITER ;