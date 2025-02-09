import "./commonStyles.css";
import TrainComponent from "./TrainComponent";
import { findLastDepartedTrain } from "../../helperFunctions";
import { TRAIN_STATUS } from "../../Constant";
import PinIcon from "../../assets/pin.png";
import RailywayTrack from "../../assets/railwayTrack.png";
import PropTypes from "prop-types";

const PlatformDisplayComponent = ({ trainData = [], numberOfPlatform }) => {
  const arr = Array.from({ length: numberOfPlatform }, (_, i) => i + 1);

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
              {getCorrectTrain(platformNo, trainData)}
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

const getCorrectTrain = (platformNo, trainData = []) => {
  const trainToFind = trainData.find(
    (train) =>
      train.trainStatus === TRAIN_STATUS.AT_PLATFORM &&
      Number(platformNo) === Number(train.platformNumber)
  );
  return (
    <TrainComponent
      key={trainToFind?.trainNumber}
      singleTrainData={trainToFind}
    />
  );
};

export default PlatformDisplayComponent;
