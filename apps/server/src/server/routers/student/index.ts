import { router } from '@/server/trpc';
import { addStudentProcedure } from './addStudent';
import { deleteStudentProcedure } from './deleteStudent';
import { editStudentProcedure } from './editStudent';
import { getStudentsPageableProcedure, getStudentsProcedure } from './getStudents';

export const student = router({
  addStudent: addStudentProcedure,
  editStudent: editStudentProcedure,
  deleteStudent: deleteStudentProcedure,
  getStudents: getStudentsProcedure,
  getStudentsPageable: getStudentsPageableProcedure,
});
