DROP TABLE IF EXISTS Players;
CREATE TABLE IF NOT EXISTS Players (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, played INTEGER, score INTEGER);

DROP TABLE IF EXISTS Parties;
CREATE TABLE IF NOT EXISTS Parties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_1 INTEGER,
  player_2 INTEGER,
  player_3 INTEGER,
  player_4 INTEGER,
  score REAL
);

DROP TABLE IF EXISTS Ranks;
CREATE TABLE IF NOT EXISTS Ranks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  low_bound INTEGER,
  high_bound INTEGER
);

INSERT INTO Players (name, played, score) VALUES ('Антон', 0, 1600);
INSERT INTO Players (name, played, score) VALUES ('Иосиф', 0, 1600);
INSERT INTO Players (name, played, score) VALUES ('Ришат', 0, 1600);
INSERT INTO Players (name, played, score) VALUES ('Саак', 0, 1600);
INSERT INTO Players (name, played, score) VALUES ('Саргис', 0, 1600);
INSERT INTO Players (name, played, score) VALUES ('Тигран', 0, 1600);
INSERT INTO Players (name, played, score) VALUES ('Ян', 0, 1600);

INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (1, 2, 3, 4, 0);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (2, 3, 1, 4, 0.5);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (5, 3, 2, 4, 0);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (5, 3, 4, 1, 1);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (6, 2, 1, 3, 0);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (6, 3, 1, 7, 0.5);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (5, 3, 4, 7, 1);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (1, 2, 5, 7, 1);

INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (1, 2, 3, 4, 0);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (2, 3, 1, 4, 0.5);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (5, 3, 2, 4, 0);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (5, 3, 4, 1, 1);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (6, 2, 1, 3, 0);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (6, 3, 1, 7, 0.5);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (5, 3, 4, 7, 1);
INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (1, 2, 5, 7, 1);

INSERT INTO Ranks (title, low_bound, high_bound) VALUES ('Новичок', 1, 1000);
INSERT INTO Ranks (title, low_bound, high_bound) VALUES ('Слабый любитель', 1000, 1199);
INSERT INTO Ranks (title, low_bound, high_bound) VALUES ('Средний любитель', 1200, 1399);
INSERT INTO Ranks (title, low_bound, high_bound) VALUES ('Третий разряд', 1400, 1599);
INSERT INTO Ranks (title, low_bound, high_bound) VALUES ('Второй разряд', 1600, 1799);
INSERT INTO Ranks (title, low_bound, high_bound) VALUES ('Первый разряд', 1800, 1999);
INSERT INTO Ranks (title, low_bound, high_bound) VALUES ('Кандидат в мастера', 2000, 2299);
INSERT INTO Ranks (title, low_bound, high_bound) VALUES ('Национальный мастер', 2300, 2399);
INSERT INTO Ranks (title, low_bound, high_bound) VALUES ('Международный мастер', 2400, 2499);
INSERT INTO Ranks (title, low_bound, high_bound) VALUES ('Гроссмейстер', 2500, 2699);
INSERT INTO Ranks (title, low_bound, high_bound) VALUES ('Международный гроссмейстер', 2700, 9999);