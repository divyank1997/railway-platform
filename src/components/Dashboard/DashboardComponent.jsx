import "./DashboardStyles.css";
import PropTypes from "prop-types";
import EmptyTrain from "../../assets/EmptyTrain.png";
import { STATUS_TO_TEXT } from "../../helper";

const DashboardComponent = ({ trainData = [] }) => {
  return (
    <div className="dashboard-table-container">
      {" "}
      {trainData.length > 0 ? (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th className="dashboard-heading">Train No</th>
              <th className="dashboard-heading">Priority</th>
              <th className="dashboard-heading">Platform</th>
              <th className="dashboard-heading">Scheduled Arrival</th>
              <th className="dashboard-heading">Actual Arrival</th>
              <th className="dashboard-heading">Scheduled Departure</th>
              <th className="dashboard-heading">Actual Departure</th>
              <th className="dashboard-heading">Delay</th>
              <th className="dashboard-heading">Status</th>
            </tr>
          </thead>
          <tbody>
            {trainData.map((train) => (
              <tr key={train.trainNumber}>
                <td className="dashboard-row">{train.trainNumber}</td>
                <td className="dashboard-row">{train.priority}</td>
                <td className="dashboard-row">{train.platformNumber}</td>
                <td className="dashboard-row">{train.scheduledArrival}</td>
                <td className="dashboard-row">{train.actualArrival}</td>
                <td className="dashboard-row">{train.scheduledDeparture}</td>
                <td className="dashboard-row">{train.actualDeparture}</td>
                <td className="dashboard-row">{train.delay}</td>
                <td className="dashboard-row">
                  {STATUS_TO_TEXT[train.status]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-dashboard-container">
          <p className="empty-text">Upload data to view charts</p>
        </div>
      )}
    </div>
  );
};

DashboardComponent.propTypes = {
  trainData: PropTypes.arrayOf(
    PropTypes.shape({
      trainNumber: PropTypes.string,
      priority: PropTypes.string,
      platformNumber: PropTypes.number,
      scheduledArrival: PropTypes.string,
      actualArrival: PropTypes.string,
      scheduledDeparture: PropTypes.string,
      actualDeparture: PropTypes.string,
      delay: PropTypes.number,
      status: PropTypes.string,
    })
  ),
};

DashboardComponent.defaultProps = {
  trainData: [],
};

export default DashboardComponent;
