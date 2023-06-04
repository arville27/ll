import { router } from '@/server/trpc';
import { addStudentClassProcedure } from './addStudentClass';
import { deleteStudentClassProcedure } from './deleteStudentClass';
import { editStudentClassProcedure } from './editStudentClass';
import {
  getStudentClassesPageableProcedure,
  getStudentClassesProcedure,
} from './getStudentClasses';

export const studentClass = router({
  addStudentClass: addStudentClassProcedure,
  editStudentClass: editStudentClassProcedure,
  deleteStudentClass: deleteStudentClassProcedure,
  getStudentClasses: getStudentClassesProcedure,
  getStudentClassesPageable: getStudentClassesPageableProcedure,
});
