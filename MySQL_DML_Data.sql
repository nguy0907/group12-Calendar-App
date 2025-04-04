-- ADD DATA INTO THE SCHEMA
USE CalendarApp;

-- 1, 'naomi', 'papp0038@algonquinlive.com', '1234'
-- 2, 'adam', 'pach0036@algonquinlive.com', '1234'
-- 3, 'kira', 'ohar0082@algonquinlive.com', '1234'
-- 4, 'loc yen', 'nguy1089@algonquinlive.com', '1234'
-- 5, 'richard', 'nguy0907@algonquinlive.com', '1234'
-- LOCK TABLES Users WRITE;
INSERT INTO Users VALUES (1, 'naomi', 'papp0038@algonquinlive.com', '1234'),
(2, 'adam', 'pach0036@algonquinlive.com', '1234'),
(3, 'kira', 'ohar0082@algonquinlive.com', '1234'),
(4, 'loc yen', 'nguy1089@algonquinlive.com', '1234'),
(5, 'richard', 'nguy0907@algonquinlive.com', '1234');
-- UNLOCK TABLES;

-- 1, 5, 'Meeting Comments', 'Meeting went super well!', '2025-03-16 14:32:00'
-- 2, 1, 'New Recipe', 'Trying out that new recipe out!', '2025-03-18 10:15:00'
-- 3, 2, 'Task Completed', 'Finished that task #GoTeam', '2025-03-19 21:40:30'
-- 4, 3, 'UI', 'UI is looking good!', '2025-03-21 13:05:00'
-- 5, 4, 'Next Meeting', 'We will be having the next meeting next week.', '2025-03-22 19:50:00'
-- LOCK TABLES SocialPosts WRITE;
INSERT INTO SocialPosts VALUES (1, 5, 'Meeting Comments', 'Meeting went super well!', '2025-03-16 14:32:00'),
(2, 1, 'New Recipe', 'Trying out that new recipe out!', '2025-03-18 10:15:00'),
(3, 2, 'Task Completed', 'Finished that task #GoTeam', '2025-03-19 21:40:30'),
(4, 3, 'UI', 'UI is looking good!', '2025-03-21 13:05:00'),
(5, 4, 'Next Meeting', 'We will be having the next meeting next week.', '2025-03-22 19:50:00');
-- UNLOCK TABLES;

-- 1, 5, 'Trello', 'Add remaining steps to Trello', '2025-03-10 10:32:00'
-- 2, 1, 'DB', 'Complete Database', '2025-03-22 15:00:00'
-- 3, 2, 'Backend Work', 'Research frameworks', '2025-03-13 09:45:00'
-- 4, 4, 'Meeting #6', 'Team meeting, check-in', '2025-03-17 18:30:00'
-- 5, 3, 'UI Check-in', 'Survey about UI', '2025-03-20 11:00:00'
-- LOCK TABLES CalendarTasks WRITE;
INSERT INTO CalendarTasks VALUES (1, 5, 'Trello', 'Add remaining steps to Trello', '2025-03-10 10:32:00'),
(2, 1, 'DB', 'Complete Database', '2025-03-22 15:00:00'),
(3, 2, 'Backend Work', 'Research frameworks', '2025-03-13 09:45:00'),
(4, 4, 'Meeting #6', 'Team meeting, check-in', '2025-03-17 18:30:00'),
(5, 3, 'UI Check-in', 'Survey about UI', '2025-03-20 11:00:00');
-- UNLOCK TABLES;
