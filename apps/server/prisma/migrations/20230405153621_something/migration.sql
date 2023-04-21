/*
  Warnings:

  - You are about to drop the column `studentId` on the `Student` table. All the data in the column will be lost.
  - Added the required column `uid` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL
);
INSERT INTO "new_Student" ("birthDate", "id", "name") SELECT "birthDate", "id", "name" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_uid_key" ON "Student"("uid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
