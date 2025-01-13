import { TaskCompletionStatsResponse } from '@api/types/TaskTypes';
import { ChartData } from 'src/interfaces/statistics';

export const processTaskCompletionData = (
  data: TaskCompletionStatsResponse[]
): ChartData[] => {
  return data.reduce((acc: ChartData[], { _id: { date, status }, count }) => {
    const existing = acc.find((item) => item.date === date);

    if (existing) {
      existing[status] = ((existing[status] as number) || 0) + count;
    } else {
      acc.push({ date, [status]: count });
    }

    return acc;
  }, []);
};
