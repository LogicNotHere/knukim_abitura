import { DATA } from "./data";

export interface FacultyFilters {
  query: string;
  interest: string;
  level: string;
  creative: string;
  format: string;
}

export interface CourseFilters {
  interest: string;
  format: string;
}

export interface MatchAnswers {
  step: number;
  interests: string[];
  activities: string[];
  level: string;
  format: string;
  creative: string;
  price: number;
}

export const emptyFacultyFilters = (): FacultyFilters => ({
  query: "",
  interest: "",
  level: "",
  creative: "",
  format: "",
});
export const initialMatch = (): MatchAnswers => ({
  step: 1,
  interests: [],
  activities: [],
  level: "bachelor",
  format: "",
  creative: "any",
  price: 60000,
});

export function filteredFaculties(filter: FacultyFilters) {
  const query = filter.query.trim().toLocaleLowerCase("uk");
  return DATA.faculties.filter((faculty) => {
    if (filter.interest && faculty.interest !== filter.interest) return false;
    const programs = DATA.programs.filter(
      (program) =>
        program.faculty === faculty.id &&
        (!filter.level || program.level === filter.level) &&
        (!filter.format || program.formats.includes(filter.format)) &&
        (!filter.creative || program.creative === (filter.creative === "yes")),
    );
    const departmentIds = new Set(
      programs.map((program) => program.department),
    );
    const text = [
      faculty.name,
      ...faculty.tags,
      ...programs.map((program) => program.name),
      ...DATA.departments
        .filter((department) => departmentIds.has(department.id))
        .map((department) => department.name),
    ]
      .join(" ")
      .toLocaleLowerCase("uk");
    return programs.length > 0 && (!query || text.includes(query));
  });
}

export function filteredCourses(filter: CourseFilters) {
  return DATA.courses.filter(
    (course) =>
      (!filter.interest || course.interest === filter.interest) &&
      (!filter.format || course.format === filter.format),
  );
}

export function matchedPrograms(match: MatchAnswers) {
  return DATA.programs
    .filter(
      (program) =>
        program.level === match.level &&
        (!match.format || program.formats.includes(match.format)) &&
        (match.creative !== "no" || !program.creative) &&
        program.price <= match.price &&
        (!match.interests.length ||
          match.interests.includes(program.interest)) &&
        (!match.activities.length ||
          match.activities.some((activity) =>
            program.activities.includes(activity),
          )),
    )
    .map((program) => ({
      program,
      score:
        (match.interests.includes(program.interest) ? 4 : 0) +
        match.activities.filter((activity) =>
          program.activities.includes(activity),
        ).length,
    }))
    .sort((a, b) => b.score - a.score || a.program.price - b.program.price)
    .slice(0, 5);
}
