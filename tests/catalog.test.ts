import assert from "node:assert/strict";
import test from "node:test";
import {
  emptyFacultyFilters,
  filteredCourses,
  filteredFaculties,
  initialMatch,
  matchedPrograms,
} from "../lib/catalog";

test("catalog search only uses programs that satisfy the study filters", () => {
  const filter = {
    ...emptyFacultyFilters(),
    query: "Екранні мистецтва та продюсування",
    level: "bachelor",
  };
  assert.deepEqual(filteredFaculties(filter), []);
  assert.deepEqual(
    filteredFaculties({ ...filter, level: "master" }).map((item) => item.id),
    ["film"],
  );
});

test("catalog department search cannot leak a department from another level", () => {
  const filter = {
    ...emptyFacultyFilters(),
    query: "телебачення та медіавиробництва",
    level: "bachelor",
  };
  assert.deepEqual(filteredFaculties(filter), []);
  assert.deepEqual(
    filteredFaculties({ ...filter, level: "master" }).map((item) => item.id),
    ["film"],
  );
});

test("catalog combines interest, level, format and creative contest", () => {
  const filter = {
    ...emptyFacultyFilters(),
    interest: "film",
    level: "master",
    format: "part",
    creative: "yes",
  };
  assert.deepEqual(
    filteredFaculties(filter).map((item) => item.id),
    ["film"],
  );
  assert.deepEqual(filteredFaculties({ ...filter, creative: "no" }), []);
  assert.deepEqual(
    filteredFaculties({ ...filter, query: "  ЕКРАННІ МИСТЕЦТВА  " }).map(
      (item) => item.id,
    ),
    ["film"],
  );
});

test("catalog reset restores all faculties", () => {
  assert.equal(filteredFaculties(emptyFacultyFilters()).length, 8);
  assert.deepEqual(
    filteredFaculties({ ...emptyFacultyFilters(), query: "неіснуючий напрям" }),
    [],
  );
});

test("courses apply direction and format together", () => {
  assert.deepEqual(
    filteredCourses({ interest: "design", format: "online" }).map(
      (item) => item.id,
    ),
    ["design-start"],
  );
  assert.deepEqual(filteredCourses({ interest: "film", format: "online" }), []);
  assert.equal(filteredCourses({ interest: "", format: "" }).length, 5);
});

test("matcher requires both an interest and an activity match", () => {
  const answers = {
    ...initialMatch(),
    interests: ["film"],
    activities: ["tech"],
  };
  assert.deepEqual(
    matchedPrograms(answers).map(({ program }) => program.id),
    ["media-production"],
  );
  assert.deepEqual(
    matchedPrograms({ ...answers, activities: ["perform"] }),
    [],
  );
  assert.deepEqual(matchedPrograms({ ...answers, interests: ["music"] }), []);
});

test("matcher intersects master level, part time, price and contest refusal", () => {
  const answers = {
    ...initialMatch(),
    level: "master",
    format: "part",
    creative: "no",
    price: 42000,
  };
  assert.deepEqual(
    matchedPrograms(answers).map(({ program }) => program.id),
    ["creative-management"],
  );
  assert.deepEqual(matchedPrograms({ ...answers, price: 41000 }), []);
  assert.deepEqual(matchedPrograms({ ...answers, interests: ["film"] }), []);
});

test("matcher honors format and inclusive price boundary", () => {
  const answers = {
    ...initialMatch(),
    interests: ["film"],
    activities: ["tech"],
    format: "part",
    price: 46000,
  };
  assert.deepEqual(
    matchedPrograms(answers).map(({ program }) => program.id),
    ["media-production"],
  );
  assert.deepEqual(matchedPrograms({ ...answers, price: 45000 }), []);
  assert.deepEqual(
    matchedPrograms({
      ...initialMatch(),
      interests: ["music"],
      format: "part",
    }),
    [],
  );
});

test("matcher ranks shared activities before price and caps the list at five", () => {
  const answers = { ...initialMatch(), activities: ["create", "people"] };
  assert.deepEqual(
    matchedPrograms(answers).map(({ program }) => program.id),
    ["event-management", "journalism", "pr", "choreography", "acting"],
  );
  assert.deepEqual(
    matchedPrograms(initialMatch()).map(({ program }) => program.id),
    ["tourism", "hospitality", "event-management", "journalism", "pr"],
  );
});
