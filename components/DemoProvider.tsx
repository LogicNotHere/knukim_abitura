"use client";
import type { ChangeEvent, MouseEvent, ReactNode } from "react";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { emptyFacultyFilters, initialMatch } from "../lib/catalog";
import type { CourseFilters } from "../lib/catalog";
import { getDemoEvents, getToday } from "../lib/events";
const initialState = () => ({
  admissionLevel: "bachelor",
  facultyFiltersOpen: false,
  faculty: emptyFacultyFilters(),
  course: {
    interest: "",
    format: "",
  } as CourseFilters,
  eventCategory: "all",
  contactCategory: "admissions",
  match: initialMatch(),
});
export type DemoDialog =
  | {
      type: "info";
    }
  | {
      type: "event" | "project";
      id: string;
    }
  | null;
function useDemoState() {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    const refresh = () => setToday(getToday());
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  const events = useMemo(() => today ? getDemoEvents(today) : [], [today]);
  const [state, setState] = useState(initialState);
  const [dialog, setDialog] = useState<DemoDialog>(null);
  const router = useRouter();
  function onAction(event: MouseEvent<HTMLButtonElement>) {
    const { action, value, id } = event.currentTarget.dataset;
    if (action === "demo-info")
      setDialog({
        type: "info",
      });
    else if ((action === "event" || action === "project") && id)
      setDialog({
        type: action,
        id,
      });
    else if (action === "close-dialog") setDialog(null);
    else if (action === "admission-level" && value)
      setState((current) => ({
        ...current,
        admissionLevel: value,
      }));
    else if (action === "filters")
      setState((current) => ({
        ...current,
        facultyFiltersOpen: !current.facultyFiltersOpen,
      }));
    else if (action === "reset-faculties")
      setState((current) => ({
        ...current,
        faculty: emptyFacultyFilters(),
      }));
    else if (action === "reset-courses")
      setState((current) => ({
        ...current,
        course: {
          interest: "",
          format: "",
        },
      }));
    else if (action === "event-category" && value)
      setState((current) => ({
        ...current,
        eventCategory: value,
      }));
    else if (action === "contact-category" && value)
      setState((current) => ({
        ...current,
        contactCategory: value,
      }));
    else if (action === "match-next") {
      if (state.match.step === 3) router.push("/results");
      else {
        setState((current) => ({
          ...current,
          match: {
            ...current.match,
            step: current.match.step + 1,
          },
        }));
        window.scrollTo(0, 0);
      }
    } else if (action === "match-back") {
      setState((current) => ({
        ...current,
        match: {
          ...current.match,
          step: Math.max(1, current.match.step - 1),
        },
      }));
      window.scrollTo(0, 0);
    } else if (action === "reset-matcher") {
      setState((current) => ({
        ...current,
        match: initialMatch(),
      }));
      router.push("/matcher");
    }
  }
  function onFieldChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const control = event.currentTarget;
    const { facultyFilter, courseFilter, match } = control.dataset;
    const value = control.value;
    if (control.id === "faculty-search")
      setState((current) => ({
        ...current,
        faculty: {
          ...current.faculty,
          query: value,
        },
      }));
    else if (facultyFilter)
      setState((current) => ({
        ...current,
        faculty: {
          ...current.faculty,
          [facultyFilter]: value,
        },
      }));
    else if (courseFilter)
      setState((current) => ({
        ...current,
        course: {
          ...current.course,
          [courseFilter]: value,
        },
      }));
    else if (match === "interests" || match === "activities") {
      const checked = (control as HTMLInputElement).checked;
      setState((current) => ({
        ...current,
        match: {
          ...current.match,
          [match]: checked
            ? [...current.match[match], value]
            : current.match[match].filter((entry) => entry !== value),
        },
      }));
    } else if (match)
      setState((current) => ({
        ...current,
        match: {
          ...current.match,
          [match]: match === "price" ? Number(value) : value,
        },
      }));
  }
  function onInterest(event: MouseEvent<HTMLAnchorElement>) {
    const id = event.currentTarget.dataset.matchInterest;
    if (id)
      setState((current) => ({
        ...current,
        match: {
          ...current.match,
          interests: [id],
          step: 1,
        },
      }));
  }
  function onTopicChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value;
    setState((current) => ({
      ...current,
      contactCategory: value,
    }));
  }
  return {
    today,
    events,
    state,
    dialog,
    setDialog,
    onAction,
    onFieldChange,
    onInterest,
    onTopicChange,
  };
}
const DemoContext = createContext<ReturnType<typeof useDemoState> | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const value = useDemoState();
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("DemoProvider is required");
  return value;
}
