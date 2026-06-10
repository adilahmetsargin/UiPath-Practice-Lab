import { StudioSimulator } from "@/components/studio-simulator";
import { studioMissions } from "@/lib/studio-missions";

export default function StudioPage() {
  return <StudioSimulator mission={studioMissions[0]} />;
}
