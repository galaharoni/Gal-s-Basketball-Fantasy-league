DELIMITER $$
DROP PROCEDURE IF EXISTS spCreateLeaguePlayers;
CREATE PROCEDURE spCreateLeaguePlayers(IN leagueId integer)
BEGIN

DECLARE startDate datetime;

SELECT currentDate
into startDate  
FROM gamedates limit 1;

INSERT INTO players (player, playerId,avgRebounds,avgAssists,avgSteals,avgBlocks,avgTurnovers,avgPoints,leagueId,createdAt,updatedAt) 
	SELECT player, playerId, avg(rebound), avg(assists), avg(steals), avg(block), avg(turnover), avg(points), leagueId, CURDATE(), CURDATE() 
    FROM nba_raw_data 
    where gameDate < startDate 
    group by player,playerId;

update players, 
		(select playerId, sum(rebound+assists+steals+block-turnover+1.1*points) as grade 
		from nba_raw_data 
		where gameDate < startDate
		group by playerId) as stats 
set players.grade = stats.grade 
where players.playerId = stats.playerId 
and players.leagueId = leagueId;   
    
END$$

DELIMITER ;