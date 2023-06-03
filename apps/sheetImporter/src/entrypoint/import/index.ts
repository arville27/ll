import * as dfs from 'date-fns';
import xlsx from 'node-xlsx';
import path from 'path';
import { exit } from 'process';
import { trpc } from '../../utils/trpc';

const COLUMN_LEGEND = {
  ROW_NUMBER: 0,
  BIRTH_DATE: 1,
  NAME: 2,
  STUDENT_UID: 3,
} as const;

const BIRTH_DATE_FORMAT = 'ddMMyy';

function readSheet(sheet: any[][]) {
  // Student data is start from index 4 or ROW 5 in spread sheet software
  return sheet.slice(4).map((row) => ({
    rowNumber: row[COLUMN_LEGEND.ROW_NUMBER],
    birthDateOri: String(row[COLUMN_LEGEND.BIRTH_DATE]),
    birthDate: dfs.parse(row[COLUMN_LEGEND.BIRTH_DATE], BIRTH_DATE_FORMAT, new Date()),
    name: String(row[COLUMN_LEGEND.NAME]),
    studentUid: String(row[COLUMN_LEGEND.STUDENT_UID]),
  }));
}

export default async (filepath: string) => {
  const sheets = xlsx.parse(path.resolve(filepath));

  const necessaryClasses = sheets.map((sheet) => sheet.name.trim());

  let studentClasses = await trpc.getStudentClasses.query();

  console.log('Inserting all necessary student classes');
  try {
    await Promise.all(
      necessaryClasses
        .filter(
          (studentClass) =>
            studentClasses.find((i) => i.className === studentClass) === undefined
        )
        .map((studentClass) => trpc.addStudentClass.mutate({ className: studentClass }))
    );
  } catch (e) {
    console.log('Error while inserting student classes');
    console.error(e);
    exit(1);
  }
  console.log('Finish inserting all necessary student classes');

  studentClasses = await trpc.getStudentClasses.query();

  console.log('Inserting students');
  try {
    await Promise.all(
      sheets
        .flatMap((sheet) =>
          readSheet(sheet.data).map((row) => ({
            birthDate: row.birthDate.getTime(),
            name: row.name,
            uid: row.studentUid,
            studentClassId: studentClasses.find((i) => i.className === sheet.name.trim())
              ?.id!,
          }))
        )
        .map((student) => trpc.addStudent.mutate(student))
    );
  } catch (e) {
    console.log('Error while inserting students');
    console.error(e);
  }
  console.log('Finish inserting students');
};
