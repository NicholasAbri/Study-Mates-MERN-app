import OverviewCards from "./OverviewCards";
import NextStepCard from "./NextStepCard";

export default function ProgressPage({
  active,
  totalTasks,
  completedTasks,
  pendingTasks,
  completionRate,
  onNextStepClick,
}) {
  return (
    <section
      id="progress"
      className={
        active ? "page progress-page active-page" : "page progress-page"
      }
    >
      <div className="progress-header">
        <h1>Progress</h1>
        <p>Track your study progress.</p>
      </div>

      <OverviewCards
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
        completionRate={completionRate}
      />

      <NextStepCard onClick={onNextStepClick} />
    </section>
  );
}
