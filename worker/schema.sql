-- Contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  message    TEXT    NOT NULL,
  created_at TEXT    NOT NULL  -- stored as ISO datetime string
);

-- Index for querying by date (newest first)
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts (created_at DESC);
