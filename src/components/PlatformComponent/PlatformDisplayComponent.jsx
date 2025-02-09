import "./commonStyles.css";
import TrainComponent from "./TrainComponent";
import { findLastDepartedTrain, STATUS_OBJ } from "../../helper";
import PinIcon from "../../assets/pin.png";
import RailywayTrack from "../../assets/railwayTrack.png";
import PropTypes from "prop-types";
const PlatformDisplayComponent = ({ trainData = [], numberOfPlatform }) => {
  const arr = Array.from({ length: numberOfPlatform }, (_, i) => i + 1);
  const getCorrectTrain = (platformNo) => {
    console.log(trainData, platformNo);
    const trainToFind = trainData.find(
      (train) =>
        train.trainStatus === "AT_PLATFORM" &&
        Number(platformNo) === Number(train.platformNumber)
    );
    if (!trainToFind) {
      return "";
    }
    return (
      <TrainComponent
        key={trainToFind?.trainNumber}
        singleTrainData={trainToFind}
      />
    );
  };
  return (
    <div className="platform-display-container">
      {arr.map((platformNo) => {
        return (
          <div key={platformNo} className="platform-items">
            <p
              className="text-primary padding-b-25"
              style={{ textAlign: "left" }}
            >
              <img src={PinIcon} />
              Platform {platformNo}{" "}
              {findLastDepartedTrain(trainData, platformNo) &&
                "- Just Departed :"}
              {findLastDepartedTrain(trainData, platformNo)}
            </p>
            <div style={{ position: "relative" }}>
              {" "}
              {getCorrectTrain(platformNo)}
            </div>
            <div style={{ paddingTop: "15px" }}>
              <img src={RailywayTrack} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
PlatformDisplayComponent.propTypes = {
  trainData: PropTypes.arrayOf(
    PropTypes.shape({
      trainNumber: PropTypes.string.isRequired,
      status: PropTypes.string,
      platformNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  numberOfPlatform: PropTypes.number.isRequired,
};

export default PlatformDisplayComponent;
