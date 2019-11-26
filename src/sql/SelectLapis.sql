select name from Artifacts;
select name, color, smell from Ingredients where status = 'rare';
select A.name from Artifacts A, Contains C where A.id = C.artifactID and safetyLevel = 'safe';

select status, count(*) from Ingredients group by status;
select count(*) from Craftable;
select name, price from Artifacts where price >= (select avg(price) from Artifacts);
