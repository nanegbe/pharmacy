-- Targeted migration to fix Drug table id type (User table untouched)

BEGIN TRANSACTION;

-- Recreate the Drug table with TEXT primary key
CREATE TABLE "new_Drug" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expiryDate" DATETIME,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Copy existing data (casting id to TEXT if needed)
INSERT INTO "new_Drug" ("id", "name", "category", "price", "quantity", "expiryDate", "description", "createdAt", "updatedAt")
SELECT CAST("id" AS TEXT), "name", "category", "price", "quantity", "expiryDate", "description", "createdAt", "updatedAt"
FROM "Drug";

-- Replace old table with new one
DROP TABLE "Drug";
ALTER TABLE "new_Drug" RENAME TO "Drug";

COMMIT;