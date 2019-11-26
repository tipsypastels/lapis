CREATE TABLE Artifacts (
  id INTEGER PRIMARY KEY AUTO INCREMENT,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  usage VARCHAR(255),
  safetyLevel VARCHAR(255) NOT NULL,
  dateModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Experiments (
  id INTEGER PRIMARY KEY AUTO INCREMENT,
  research VARCHAR(255) NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE Ingredients(
  id INTEGER PRIMARY KEY AUTO INCREMENT,
  name VARCHAR(255) NOT NULL,
  source VARCHAR(255) NOT NULL,
  color VARCHAR(255),
  smell VARCHAR(255),
  status VARCHAR(255) NOT NULL DEFAULT 'common',
  state VARCHAR(255) NOT NULL DEFAULT 'solid'
);

CREATE TABLE Users(
  id INTEGER PRIMARY KEY AUTO INCREMENT,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL
);

CREATE TABLE Craftable (
  artifactid INTEGER PRIMARY KEY AUTO INCREMENT,
  instructions VARCHAR(255) NOT NULL
);

CREATE TABLE AuthoredBy (
  artifactID INTEGER,
  experimentID INTEGER,
  PRIMARY KEY(artifactID, experimentID),
  FOREIGN KEY (artifactID) REFERENCES Artifacts (id),
  FOREIGN KEY (experimentID) REFERENCES Experiments (id)
);

CREATE TABLE Run(
  userID INTEGER,
  experimentID INTEGER,
  PRIMARY KEY (userID, experimentID),
  FOREIGN KEY (userID) REFERENCES Users (id),
  FOREIGN KEY (experimentID) REFERENCES Experiments (id)
);

CREATE TABLE PerformedOn (
  artifactID INTEGER,
  experimentID INTEGER,
  PRIMARY KEY (artifactID, experimentID),
  FOREIGN KEY (artifactID) REFERENCES Artifacts (id),
  FOREIGN KEY (experimentID) REFERENCES Experiments (id)
);

CREATE TABLE Containing(
  artifactID INTEGER,
  ingredientID INTEGER,
  PRIMARY KEY (artifactID, ingredientID),
  FOREIGN KEY (artifactID) REFERENCES Artifacts (id),
  FOREIGN KEY (ingredientID) REFERENCES Ingredients (id)
);

CREATE TABLE Similar (
  artifactid INTEGER PRIMARY KEY AUTO INCREMENT,
  similarArtifactID INTEGER,
  similarDescription Varchar(255),
  FOREIGN KEY (artifactID) REFERENCES Artifacts (id),
  FOREIGN KEY (similarArtifactID) REFERENCES Artifacts (id)
);

CREATE TABLE TestersHave (
  experimentid INTEGER PRIMARY KEY AUTO INCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL,
  completionDate VARCHAR(255),
  phoneNumber VARCHAR(255),
  address VARCHAR (255),
  FOREIGN KEY(experimentID) REFERENCES Experiments (id)
);