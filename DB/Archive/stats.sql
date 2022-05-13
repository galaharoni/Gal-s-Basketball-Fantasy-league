select min(gameDate) from nba_raw_data

select count(1) from nba_raw_data

select `teamAbbrev`, count(1)
from nba_raw_data
group by teamAbbrev
order by count(1) desc
#`gameId`,`gameDate`,`HA`,

select team, min(games_cnt) as min_games, max(games_cnt) as max_games
from
(
select team, week_year, count(1) as games_cnt 
from (
select distinct teamAbbrev as team, gameId, concat(year(gameDate),'-',week(gameDate)) as week_year
from nba_raw_data
union 
select distinct opponentAbbrev as team, gameId, concat(year(gameDate),'-',week(gameDate)) as week_year
from nba_raw_data
#order by week_year, team
) as games
group by team, week_year) as games_week
group by team order by max_games desc

select count(1) from (
select distinct team from (
select teamAbbrev as team
from nba_raw_data
union
select opponentAbbrev as team
from nba_raw_data ) as teams) as t

