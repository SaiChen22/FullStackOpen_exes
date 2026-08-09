import {
  Favorite,
  LocalHospital,
  Work
} from "@mui/icons-material";

import { Entry } from "../types";
import HealthRatingBar from "./HealthRatingBar";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry: ${JSON.stringify(value)}`);
};

interface Props {
  entry: Entry;
}

const EntryDetails = ({ entry }: Props) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <div>
          <LocalHospital />
          <p>
            discharge: {entry.discharge.date}<br />
            criteria: {entry.discharge.criteria}
          </p>
        </div>
      );

    case "OccupationalHealthcare":
      return (
        <div>
          <Work />
          <p>employer: {entry.employerName}</p>

          {entry.sickLeave && (
            <p>
              sick leave: {entry.sickLeave.startDate}
              {" — "}
              {entry.sickLeave.endDate}
            </p>
          )}
        </div>
      );

    case "HealthCheck":
      return (
        <div>
          <Favorite />
          <HealthRatingBar
            rating={entry.healthCheckRating}
            showText={true}
          />
        </div>
      );

    default:
      return assertNever(entry);
  }
};

export default EntryDetails;