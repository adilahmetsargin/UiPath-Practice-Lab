"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { studioMissions } from "@/lib/studio-missions";
import { readLocalProgress } from "@/lib/local-progress";
import { StudioSimulator } from "@/components/studio-simulator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MissionWorkspace() {
  const [selectedMissionId, setSelectedMissionId] = useState(studioMissions[0].id);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const selectedMission = studioMissions.find((mission) => mission.id === selectedMissionId) || studioMissions[0];

  function syncProgress() {
    setCompletedIds(readLocalProgress().completedTaskIds);
  }

  useEffect(() => {
    syncProgress();
    window.addEventListener("uipath-progress-updated", syncProgress);
    window.addEventListener("storage", syncProgress);
    return () => {
      window.removeEventListener("uipath-progress-updated", syncProgress);
      window.removeEventListener("storage", syncProgress);
    };
  }, []);

  return (
    <section className="min-h-[calc(100vh-65px)] bg-slate-100">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <p className="text-sm font-medium text-primary">Start here tonight</p>
          <h1 className="mt-1 text-3xl font-semibold">Interactive RPA Missions</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Pick a mission, build the workflow in the browser studio, press Run, and fix failed activities until the bot passes.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 xl:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Mission path</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {studioMissions.map((mission, index) => {
              const complete = completedIds.includes(mission.progressTaskId);
              const selected = mission.id === selectedMission.id;
              return (
                <button
                  key={mission.id}
                  onClick={() => setSelectedMissionId(mission.id)}
                  className={cn("w-full rounded-md border bg-white p-4 text-left hover:bg-slate-50", selected && "border-blue-400 bg-blue-50")}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge className="bg-slate-50 text-slate-700">Mission {index + 1}</Badge>
                    {complete ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <PlayCircle className="h-5 w-5 text-primary" />}
                  </div>
                  <p className="font-medium">{mission.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{mission.goal}</p>
                  <div className="mt-3 flex gap-2">
                    <Badge className="bg-blue-50 text-blue-700">{mission.level}</Badge>
                    <Badge className="bg-white text-slate-700">{mission.xp} XP</Badge>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4">
            <div>
              <p className="text-sm font-medium text-primary">Selected mission</p>
              <h2 className="text-xl font-semibold">{selectedMission.title}</h2>
            </div>
            <Button onClick={() => setSelectedMissionId(studioMissions[(studioMissions.findIndex((mission) => mission.id === selectedMission.id) + 1) % studioMissions.length].id)}>
              Next mission
            </Button>
          </div>
          <StudioSimulator mission={selectedMission} embedded onMissionComplete={syncProgress} />
        </div>
      </div>
    </section>
  );
}
