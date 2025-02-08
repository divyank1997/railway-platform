import "./commonStyles.css";
import PropTypes from "prop-types";
const TrainComponent = ({ key, singleTrainData }) => {
  const { trainNumber, priority, actualArrival, status } = singleTrainData;
  return (
    <div className="train-card" key={key}>
      <div className="train-info">
        <span className="train-number">{trainNumber}</span>
        <span className="train-priority">{priority}</span>
      </div>
      <div className="train-arrival">{actualArrival}</div>
    </div>
  );
};

TrainComponent.propTypes = {
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  singleTrainData: PropTypes.shape({
    trainNumber: PropTypes.string.isRequired,
    priority: PropTypes.string,
    actualArrival: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

export default TrainComponent;
