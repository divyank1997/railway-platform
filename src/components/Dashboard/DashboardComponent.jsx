const DashboardComponent = ({ trainData = {} }) => {
  const {
    trainNumber,
    priority,
    platformNumber,
    scheduledArrival,
    actualArrival,
    scheduledDeparture,
    actualDeparture,
    status,
  } = trainData;
  return (
    <table>
      <thead>
        <tr>
          <th>Train Number</th>
          <th>Priority</th>
          <th>Platform</th>
          <th>Scheduled Arrival</th>
          <th>Actual Arrival</th>
          <th>Scheduled Departure</th>
          <th>Actual Departure</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {trainData.length > 0 ? (
          <></>
        ) : (
          <tr>
            <td>No train history available. Please upload a CSV file.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DashboardComponent;
