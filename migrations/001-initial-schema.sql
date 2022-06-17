-- Up

    CREATE TABLE Blog(
        id INTEGER PRIMARY KEY,
        title VARCHAR(250),
        author VARCHAR(250),
        createdAt DATETIME DEFAULT (datetime('now','localtime')),
        updatedAt DATETIME DEFAULT (datetime('now','localtime')),
        category VARCHAR(250),
        description TEXT
    );

-- Down

DROP TABLE Blog;