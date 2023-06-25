export function extractClassAttribute(studentClass: string) {
  const lastSpaceIndex = studentClass.lastIndexOf(' ');
  if (lastSpaceIndex == -1)
    return {
      name: studentClass,
      grade: NaN,
    };
  const name = studentClass.substring(0, lastSpaceIndex);
  const grade = Number(studentClass.substring(lastSpaceIndex + 1));
  return {
    name,
    grade,
  };
}
