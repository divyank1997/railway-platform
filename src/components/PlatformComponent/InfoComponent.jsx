const InfoComponent = ({
  platformInput = 2,
  handleFileUpload = () => {},
  handlePlatformNumber = () => {},
  handlePlatformSubmit = () => {},
  currentTime,
}) => {
  return (
    <>
      <h1>Train Status Dashboard</h1>
      <p>Current Time: {currentTime.toLocaleTimeString()}</p>

      <div>
        <div>
          <label>
            Number of Platforms (2-20):
            <input
              type="number"
              placeholder="Enter Number Between 2 and 20"
              value={platformInput}
              onChange={handlePlatformNumber}
            />
          </label>
          <button onClick={handlePlatformSubmit}>Update Platforms</button>
        </div>

        <div>
          <label>
            Upload Train Schedule (CSV):
            <input type="file" accept=".csv" onChange={handleFileUpload} />
          </label>
        </div>

        <div>
          <p>Active Platforms: {platformInput}</p>
        </div>
      </div>
    </>
  );
};

export default InfoComponent;
