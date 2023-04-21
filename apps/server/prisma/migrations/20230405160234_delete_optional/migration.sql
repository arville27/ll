/*
  Warnings:

  - Made the column `studentId` on table `AttendanceLog` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AttendanceLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "studentId" INTEGER NOT NULL,
    CONSTRAINT "AttendanceLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AttendanceLog" ("date", "id", "studentId") SELECT "date", "id", "studentId" FROM "AttendanceLog";
DROP TABLE "AttendanceLog";
ALTER TABLE "new_AttendanceLog" RENAME TO "AttendanceLog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
