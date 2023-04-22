import { Student } from '@prisma/client';
import { create } from 'zustand';

type SelectedStudent = {
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
};

export const useSelectedStudentStore = create<SelectedStudent>((set) => ({
  selectedStudent: null,
  setSelectedStudent: (student: Student | null) =>
    set(() => ({ selectedStudent: student })),
}));
