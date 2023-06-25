export function extractClassAttribute(studentClass: string) {
  const lastSpaceIndex = studentClass.lastIndexOf(' ');
  const name = studentClass.substring(0, lastSpaceIndex);
  const grade = Number(studentClass.substring(lastSpaceIndex + 1));
  if (lastSpaceIndex == -1 || isNaN(grade) || grade === 0)
    return {
      name: studentClass,
      grade: NaN,
    };
  return {
    name,
    grade,
  };
}
