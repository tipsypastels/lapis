export default {
  Artifacts: `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255),
      usage VARCHAR(255),
      safetyLevel VARCHAR(255) NOT NULL,
      dateModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `,
  Experiments: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    research VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    startDate VARCHAR(255) NOT NULL,
    endDate VARCHAR(255),
    artifactID INTEGER NOT NULL,
    FOREIGN KEY (artifactID) references Artifacts (id)
  `,
  Ingredients: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL,
    color VARCHAR(255),
    smell VARCHAR(255),
    status VARCHAR(255) NOT NULL DEFAULT 'common',
    state VARCHAR(255) NOT NULL DEFAULT 'solid'
  `,
  Users: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL
  `,
  Craftable: `
    artifactID INTEGER PRIMARY KEY AUTOINCREMENT,
    instructions VARCHAR(255) NOT NULL
  `,
  AuthoredBy: `
    artifactID INTEGER,
    experimentID INTEGER,
    PRIMARY KEY(artifactID, experimentID),
    FOREIGN KEY (artifactID) REFERENCES Artifacts (id),
    FOREIGN KEY (experimentID) REFERENCES Experiments (id)
  `,
  Run: `
    userID INTEGER,
    experimentID INTEGER,
    PRIMARY KEY (userID, experimentID),
    FOREIGN KEY (userID) REFERENCES Users (id),
    FOREIGN KEY (experimentID) REFERENCES Experiments (id)
  `,
  Containing: `
    artifactID INTEGER,
    ingredientID INTEGER,
    PRIMARY KEY (artifactID, ingredientID),
    FOREIGN KEY (artifactID) REFERENCES Artifacts (id),
    FOREIGN KEY (ingredientID) REFERENCES Ingredients (id)
  `,
  Similar: `
    artifactID INTEGER PRIMARY KEY,
    similarArtifactID INTEGER,
    similarDescription Varchar(255),
    FOREIGN KEY (artifactID) REFERENCES Artifacts (id),
    FOREIGN KEY (similarArtifactID) REFERENCES Artifacts (id)
  `,
  TestersHave: `
    experimentID INTEGER PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    completionDate VARCHAR(255),
    phoneNumber VARCHAR(255),
    address VARCHAR (255),
    FOREIGN KEY(experimentID) REFERENCES Experiments (id)
  `
}