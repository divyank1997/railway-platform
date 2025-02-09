import React from "react";
import DashboardComponent from "../Dashboard/DashboardComponent";
import InfoComponent from "../PlatformComponent/InfoComponent";
import "../commonScreenStyles.css";
import UploadImg from "../../assets/upload.png";
import PlatformDisplayComponent from "../PlatformComponent/PlatformDisplayComponent";
import { useTrainPlatform } from "./usePlatformHook";

const TrainPlatform = () => {
  const {
    dashboardProps,
    fileInputRef,
    handleFileUpload,
    handleButtonClick,
    infoComponentProps,
    platformDisplayProps,
  } = useTrainPlatform();

  return (
    <div className="main-container">
      <h1 className="main-heading">Railway Platform Display</h1>
      <div className="platform-container">
        <div className="dashboard-container">
          <DashboardComponent {...dashboardProps} />
          <div className="csvbutton-container">
            <div>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <button className="upload-button" onClick={handleButtonClick}>
                <img src={UploadImg} /> Upload File
              </button>
            </div>
          </div>
        </div>

        <div className="info-container">
          <InfoComponent {...infoComponentProps} />
          <PlatformDisplayComponent {...platformDisplayProps} />
        </div>
      </div>
    </div>
  );
};

export default TrainPlatform;
