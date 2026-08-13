import { JobApplication, StatisticsData } from '../types/application';

export function calculateStatistics(applications: JobApplication[]): StatisticsData {
  let applied = 0;
  let interview = 0;
  let offer = 0;
  let nextDeadline: string | undefined = undefined;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingDeadlines: string[] = [];

  for (const app of applications) {
    if (app.status === 'applied') applied++;
    if (app.status === 'interview') interview++;
    if (app.status === 'offer') offer++;

    if (app.deadline) {
      const d = new Date(app.deadline);
      if (!isNaN(d.getTime()) && d >= today) {
        upcomingDeadlines.push(app.deadline);
      }
    }
  }

  if (upcomingDeadlines.length > 0) {
    upcomingDeadlines.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    nextDeadline = upcomingDeadlines[0];
  }

  return {
    total: applications.length,
    applied,
    interview,
    offer,
    nextDeadline,
  };
}
