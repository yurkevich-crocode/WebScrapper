import { WorkTime } from "./work-time";

export class WorkHours {
    isClosed: boolean;
    weekDay: number;
    startTime: WorkTime | null;
    endTime: WorkTime | null;
}