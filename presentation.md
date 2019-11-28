1. [1 Mark] Projection query: Create one query of this category and provide an interface
for the user to specify the projection conditions to be returned.
	-view all the users
		SELECT id, name, role 
    		FROM users

2. [1 Mark] Selection query : Create one query of this category and provide an interface
for the user to specify the selection conditions to be returned.
	-find all the artifacts that are dangerous
		SELECT name, description, function, safetyLevel, dateModified
		FROM Artifacts
		WHERE safetyLevel = 'dangerous'

3. [1 Mark] Join query: Pick one query of this category, which joins at least two tables and
performs a meaningful query, and provide an interface for the user to choose this query
(e.g. join the Customers and the Transactions table to find the phone numbers of all
customers who has purchased a specific item).
	-Find all the users who authored love potion
		SELECT u.name
		FROM Users u, AuthoredBy b, Artifacts a
		WHERE b.userID = u.id
			AND b.artifactID = a.id
			AND a.name = 'Love Potion'

4. [2 Mark] Division query: Pick one query of this category and provide an interface for
the user to choose this query (e.g. find all the customers who bought all the items).
	-Find all the artifacts that is authored by all the users
		SELECT a.name
		FROM Artifacts a
		WHERE NOT EXISTS
			(SELECT u.id
			FROM Users u
			WHERE NOT EXISTS
				(SELECT b.aid
				FROM AuthoredBY b
				WHERE b.artifactID = a.id
					AND b.userID = u.id)

5. [2 Mark] Aggregation query: Pick two queries that require the use of distinct
aggregation (min, max, average, or count are all fine).
	-Find the experiment with the greatest number of testers
		SELECT experimentID, MAX(COUNT(name))
		FROM TestersHave
		GROUP BY experimentID
	-Count all the artifacts
		SELECT COUNT(*)
		FROM Artifacts

6. [1 Mark] Nested aggregation with group-by: Pick one query that finds some
aggregated value for each group (e.g. the average number of items purchased per
customer).
	-Find the average number of artifacts authored by the users
		SELECT  AVG(artifactCount)
		FROM 
			(SELECT userID, COUNT(artifactID) AS artifactCount
			FROM authored by
			GROUP BY userID)

7. [1 Marks] Delete operation: Implement a cascade-on-delete situation. Provide an
interface for the user to specify some input for the deletion operation. Based on input,
deletion should be performed.
	-Delete User (testers involved in that experiment should be deleted also)
		DELETE FROM experiments
    		WHERE id = 2222

8. [1 Marks] Update Operation: Provide an interface for the user to specify some input
for the update operation.
	- Update artifacts
		UPDATE Artifacts
		SET safetyLevel = 'dangerous'
		WHERE id = 1001
