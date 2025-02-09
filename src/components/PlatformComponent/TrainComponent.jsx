import "./commonStyles.css";
import PropTypes from "prop-types";
import TrainBox from "../../assets/TrainBox.png";
const TrainComponent = ({ key, singleTrainData = {} }) => {
  const { trainNumber, priority, actualArrival, status } = singleTrainData;
  return (
    <div
      className={`train-card ${Object.keys(singleTrainData).length > 0 ? "visible" : "exit"}`}
      key={key}
    >
      <div className="train-info">
        <span className="train-number">{trainNumber}</span>
        <span className="train-arrival">Time - {actualArrival}</span>
      </div>

      <img src={TrainBox} />
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
