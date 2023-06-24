import * as dfs from 'date-fns';
import xlsx from 'node-xlsx';
import path from 'path';
import { exit } from 'process';
import { trpc } from '../../utils/trpc';
import { error } from 'console';

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

function extractClassAttribute(studentClass: string) {
  const lastSpaceIndex = studentClass.lastIndexOf(' ');
  const name = studentClass.substring(0, lastSpaceIndex);
  const grade = Number(studentClass.substring(lastSpaceIndex + 1));
  if (lastSpaceIndex == -1 || isNaN(grade))
    throw `Invalid student class format: ${studentClass}`;
  return {
    name,
    grade,
  };
}

export default async (filepath: string) => {
  const sheets = xlsx.parse(path.resolve(filepath));

  const necessaryClasses = sheets.map((sheet) => sheet.name.trim());

  let studentClasses = await trpc.getStudentClasses.query({});

  console.log('Inserting all necessary student classes');
  try {
    await Promise.all(
      necessaryClasses
        .map((studentClass) => extractClassAttribute(studentClass.trim()))
        .filter(
          (studentClass) =>
            studentClasses.find(
              (i) => i.name === studentClass.name && i.grade === studentClass.grade
            ) === undefined
        )
        .map((studentClass) => {
          trpc.addStudentClass.mutate(studentClass);
        })
    );
  } catch (e) {
    console.log('Error while inserting student classes');
    console.error(e);
    exit(1);
  }
  console.log('Finish inserting all necessary student classes');

  studentClasses = await trpc.getStudentClasses.query({});

  console.log('Inserting students');
  try {
    await Promise.all(
      sheets
        .flatMap((sheet) => {
          const classIdentifiers = extractClassAttribute(sheet.name.trim());
          return readSheet(sheet.data).map((row) => ({
            birthDate: row.birthDate.getTime(),
            name: row.name,
            uid: row.studentUid,
            studentClassId: studentClasses.find(
              (i) =>
                i.name === classIdentifiers.name && i.grade === classIdentifiers.grade
            )?.id!,
          }));
        })
        .map((student) => trpc.addStudent.mutate(student))
    );
  } catch (e) {
    console.log('Error while inserting students');
    console.error(e);
  }
  console.log('Finish inserting students');
};
