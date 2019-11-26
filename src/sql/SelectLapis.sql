select name from Artifacts;
select name, color, smell from Ingredients where status = "rare";
select A.name from Artifacts A, Contains C where A.id = C.artifactID and safetyLevel = "safe";
select A.name from Artifacts A where not exists (select U.id from User where not exists (select T.userID from AuthoredBy));
select status, count(*) from Ingredients group by status;
select count(*) from Craftable;
select name, price from Artifacts where price >= (select avg(price) from Artifacts);
delete from Artifacts where name like ""%ring%"";    ---needs cascade delete from schema
update TestersHave set address = "4589 146B street, Surrey" where name = "Dax Swift";

