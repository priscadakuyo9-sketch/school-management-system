-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subjectType" TEXT NOT NULL DEFAULT 'LITERARY',
    "day" TEXT NOT NULL DEFAULT 'Lundi',
    "slot" TEXT NOT NULL DEFAULT '07:00–09:00',
    "room" TEXT,
    "teacherId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    CONSTRAINT "Course_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Course_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("classId", "description", "id", "name", "subjectType", "teacherId") SELECT "classId", "description", "id", "name", "subjectType", "teacherId" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
