export default function NextStepCard({ onClick }) {
  return (
    <div className="next-step-card" role="button" onClick={onClick}>
      <div className="next-step-icon">
        <i className="fa-solid fa-arrow-right"></i>
      </div>
      <div className="next-step-text">
        <h2>Next Step</h2>
        <p>Complete one pending task today</p>
        <span>to improve your progress.</span>
      </div>
      <div className="next-step-arrow">
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    </div>
  );
}
