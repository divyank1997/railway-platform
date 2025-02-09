import "./commonStyles.css";
import PropTypes from "prop-types";
const InfoComponent = ({
  platformInput = 2,
  handleFileUpload = () => {},
  handlePlatformNumber = () => {},
  handlePlatformSubmit = () => {},
  currentTime,
}) => {
  return (
    <div className="input-button-container">
      {" "}
      <p className="text-primary">Number of Platform</p>
      <div className="input-container">
        <input
          className="input-primary"
          type="number"
          placeholder="Enter Number Between 2 and 20"
          value={platformInput}
          onChange={handlePlatformNumber}
        />
        <button className="button-secondary" onClick={handlePlatformSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

InfoComponent.propTypes = {
  platformInput: PropTypes.number,
  handleFileUpload: PropTypes.func,
  handlePlatformNumber: PropTypes.func,
  handlePlatformSubmit: PropTypes.func,
  currentTime: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.number,
  ]),
};

export default InfoComponent;
