DELIMITER $$
#DROP PROCEDURE IF EXISTS spAddScore;
CREATE PROCEDURE spAddScore(IN endDate datetime)
BEGIN

# the league start Date is current date
DECLARE startDate datetime;
DECLARE finished INT;
DECLARE runningLeagueId INT;
-- declare cursor for running leagues
DEClARE curRunLeagues CURSOR FOR 
		SELECT id FROM leagues where leagueMode = 'Run';
-- declare NOT FOUND handler
DECLARE CONTINUE HANDLER 
	FOR NOT FOUND SET finished = 1;

SELECT currentDate
into startDate  
FROM gamedates limit 1;

#update team score
update teams t1,
	(select t.id, sum(n.rebound+n.assists+n.steals+n.block-n.turnover+1.1*n.points) as score 
	from nba_raw_data n 
		join players p on n.playerId = p.playerId 
		join teams t on t.id = p.teamId 
		join leagues l on l.id = t.leagueId
	where n.gameDate > startDate and n.gameDate <= endDate
	and l.leagueMode = 'Run'
	group by t.id) s
set t1.score = ifnull(t1.score,0) + s.score
where t1.id = s.id;

# update players score

update players p1,
	(select p.id, sum(n.rebound+n.assists+n.steals+n.block-n.turnover+1.1*n.points) as score 
	from nba_raw_data n 
		join players p on n.playerId = p.playerId 
		join leagues l on l.id = p.leagueId
	where n.gameDate > startDate and n.gameDate <= endDate
	and l.leagueMode = 'Run'
	group by p.id) s 
set p1.score = ifnull(p1.score,0) + s.score
where p1.id = s.id;

#update playes avrages

update players p,
	(SELECT n.playerId, avg(rebound) as avgRebounds, avg(assists) as avgAssists, avg(steals) as avgSteals, avg(block) as avgBlocks, avg(turnover) as avgTurnovers, avg(points) as avgPoints
	from nba_raw_data n 
		join players p on n.playerId = p.playerId 
		join leagues l on l.id = p.leagueId
	where n.gameDate <= endDate
	and l.leagueMode = 'Run'
    group by playerId) s
set 
	p.avgRebounds = s.avgRebounds,
	p.avgAssists = s.avgAssists,
	p.avgSteals = s.avgSteals,
	p.avgBlocks = s.avgBlocks,
	p.avgTurnovers = s.avgTurnovers,
	p.avgPoints = s.avgPoints 
where p.playerId = s.playerId;

# Update places for all running leagugs
OPEN curRunLeagues;

getLeague: LOOP
	FETCH curRunLeagues INTO runningLeagueId;
	IF finished = 1 THEN 
		LEAVE getLeague;
	END IF;

	#update places
	SET @rownumber = 0;    
	update teams 
    set place = (@rownumber:=@rownumber+1)
    where leagueId = runningLeagueId
	order by score desc;   

END LOOP getLeague;
CLOSE curRunLeagues;

#update current round in leagus
update leagues
set currentRound = ifnull(currentRound, 0) + 1
where leagueMode = 'Run';

# update league mode to Close if this round was the last round
update leagues
set leagueMode = 'Close'
where leagueMode = 'Run'
and currentRound=Rounds;

#update currentDate
update gamedates
set currentDate = endDate; 


END$$

DELIMITER ;