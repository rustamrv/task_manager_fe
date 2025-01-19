import { TaskCompletionStatsResponse } from '@api/types/TaskTypes';
import { ChartData } from 'src/interfaces/Statistics';

export const processTaskCompletionData = (
  data: TaskCompletionStatsResponse[]
): ChartData[] => {
  const normalizedData: Record<string, ChartData> = {};

  data.forEach(
    ({ _id: { date, status }, count }: TaskCompletionStatsResponse) => {
      const normalizedStatus = status.toLowerCase();

      if (!normalizedData[date]) {
        normalizedData[date] = { date, 'to do': 0, done: 0, 'in-progress': 0 };
      }

      normalizedData[date][normalizedStatus] =
        ((normalizedData[date][normalizedStatus] as number) || 0) + count;
    }
  );

  return Object.values(normalizedData);
};
