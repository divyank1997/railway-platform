import "./commonStyles.css";
import TrainComponent from "./TrainComponent";
import { STATUS_OBJ } from "../../helper";
import PinIcon from "../../assets/pin.png";
import PropTypes from "prop-types";
const PlatformDisplayComponent = ({ trainData = [], numberOfPlatform }) => {
  const arr = Array.from({ length: numberOfPlatform }, (_, i) => i);
  const getCorrectTrain = (platformNo) => {
    const train = trainData.find(
      (train) =>
        (train.status =
          STATUS_OBJ["AT_PLATFORM"] &&
          Number(platformNo) === Number(trainData.platformNumber))
    );
    console.log(train, "trainrani", trainData, platformNo);
    if (!train) {
      return "";
    }
    return <TrainComponent key={train.trainNumber} singleTrainData={train} />;
  };
  return (
    <div className="platform-display-container">
      {arr.map((platformNo) => {
        return (
          <div key={platformNo}>
            <p className="text-primary">
              <img src={PinIcon} />
              {platformNo}
            </p>
            <div> {getCorrectTrain(platformNo)}</div>
            {/* {status === STATUS_OBJ["AT_PLATFORM"] &&  (
                <TrainComponent key={trainNumber} singleTrainData={train} />
              )} */}
          </div>
        );
      })}
      {/* {trainData.map((train) => {
        const { trainNumber, status } = train;
        return (
          status === STATUS_OBJ["AT_PLATFORM"] && (
            <TrainComponent key={trainNumber} singleTrainData={train} />
          )
        );
      })} */}
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
