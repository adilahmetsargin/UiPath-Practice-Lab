import { allTasks, lessons } from "@/lib/course-data";

export const progressStorageKey = "uipath-practice-progress";
export const demoSessionKey = "uipath-practice-demo-session";

export type LocalProgress = {
  completedTaskIds: string[];
};

export function readLocalProgress(): LocalProgress {
  if (typeof window === "undefined") return { completedTaskIds: [] };

  try {
    const parsed = JSON.parse(window.localStorage.getItem(progressStorageKey) || "{}");
    return {
      completedTaskIds: Array.isArray(parsed.completedTaskIds) ? parsed.completedTaskIds : []
    };
  } catch {
    return { completedTaskIds: [] };
  }
}

export function completeLocalTask(taskId: string) {
  const progress = readLocalProgress();
  const completedTaskIds = Array.from(new Set([...progress.completedTaskIds, taskId]));
  window.localStorage.setItem(progressStorageKey, JSON.stringify({ completedTaskIds }));
  window.dispatchEvent(new Event("uipath-progress-updated"));
  return completedTaskIds;
}

export function getProgressStats(completedTaskIds: string[]) {
  const completedSet = new Set(completedTaskIds);
  const completedTasks = allTasks.filter((task) => completedSet.has(task.id));
  const xp = completedTasks.reduce((sum, task) => sum + task.xp, 0);
  const currentLesson = lessons.find((lesson) => lesson.tasks.some((task) => !completedSet.has(task.id))) || lessons[lessons.length - 1];

  return {
    completedTasks,
    completedCount: completedTasks.length,
    xp,
    currentLevel: currentLesson.level,
    percent: Math.round((completedTasks.length / allTasks.length) * 100)
  };
}
