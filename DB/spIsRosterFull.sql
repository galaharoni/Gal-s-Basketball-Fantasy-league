DELIMITER $$
DROP PROCEDURE IF EXISTS spRosterFull;
CREATE PROCEDURE spRosterFull(IN checkLeaugeId integer, IN teamSize integer)
BEGIN

declare teamsCount integer;

select count(1)
into teamsCount
from
	(select teamid, count(1)
	from players
	where leagueid=checkLeaugeId
	group by teamid
	having count(1) < teamSize) calc;
    
select 'teams count missing players:' + teamsCount;

if (teamsCount=0) then
		update leagues
        set leagueMode='Run'
        where id=checkLeaugeId; 
end if;    

END$$

DELIMITER ;