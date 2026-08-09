import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

import { Diagnosis, Patient, NewEntry,} from "../../types";
import patientService from "../../services/patients";

import EntryDetails from "../EntryDetails";
import axios from "axios";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [error, setError] = useState<string>();
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [rating, setRating] = useState("0");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  type EntryType = NewEntry["type"];

  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");

  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");

  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      const patient = await patientService.getById(id);
      setPatient(patient);
    };

    void fetchPatient();
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const submitEntry = async (entry: NewEntry) => {
    if (!id) return;

    try {
      const createdEntry = await patientService.addEntry(id, entry);

      setPatient((currentPatient) => {
        if (!currentPatient) return currentPatient;

        return {
          ...currentPatient,
          entries: currentPatient.entries.concat(createdEntry),
        };
      });

      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError("Invalid entry data");
      } else {
        setError("Something went wrong");
      }
    }
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const codes = diagnosisCodes.length > 0 ? diagnosisCodes : undefined;

    switch (entryType) {
      case "HealthCheck":
        void submitEntry({
          type: "HealthCheck",
          description,
          date,
          specialist,
          diagnosisCodes: codes,
          healthCheckRating: Number(rating) as 0 | 1 | 2 | 3,
        });
        break;

      case "Hospital":
        void submitEntry({
          type: "Hospital",
          description,
          date,
          specialist,
          diagnosisCodes: codes,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        });
        break;

      case "OccupationalHealthcare":
        void submitEntry({
          type: "OccupationalHealthcare",
          description,
          date,
          specialist,
          diagnosisCodes: codes,
          employerName,
          ...(sickLeaveStartDate && sickLeaveEndDate
            ? {
                sickLeave: {
                  startDate: sickLeaveStartDate,
                  endDate: sickLeaveEndDate,
                },
              }
            : {}),
        });
        break;
    }
  };

  return (
    <div>
      <div>
        <h2>{patient.name}</h2>
        <div>ssn: {patient.ssn}</div>
        <div>occupation: {patient.occupation}</div>
      </div>

      <select
        value={entryType}
        onChange={(event) => setEntryType(event.target.value as EntryType)}
      >
        <option value="HealthCheck">Health check</option>
        <option value="Hospital">Hospital</option>
        <option value="OccupationalHealthcare">Occupational healthcare</option>
      </select>
      <form onSubmit={handleSubmit}>
        <h3>Add health check entry</h3>

        {error && <p>{error}</p>}
      <label>Description:
        <input
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        </label>

        <label>Date:
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        </label>

        <label>Specialist:
        <input
          placeholder="Specialist"
          value={specialist}
          onChange={(event) => setSpecialist(event.target.value)}
        />
        </label>

        <FormControl fullWidth>
          <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>

          <Select
            labelId="diagnosis-codes-label"
            multiple
            value={diagnosisCodes}
            onChange={(event) => {
              const value = event.target.value;

              setDiagnosisCodes(
                typeof value === "string" ? value.split(",") : value,
              );
            }}
            input={<OutlinedInput label="Diagnosis codes" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                <Checkbox checked={diagnosisCodes.includes(diagnosis.code)} />
                <ListItemText
                  primary={`${diagnosis.code} — ${diagnosis.name}`}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {entryType === "HealthCheck" && (
          <FormControl fullWidth>
            <InputLabel id="rating-label">Health rating</InputLabel>

            <Select
              labelId="rating-label"
              label="Health rating"
              value={rating}
              onChange={(event) =>
                setRating(event.target.value as "0" | "1" | "2" | "3")
              }
            >
              <MenuItem value="0">Healthy</MenuItem>
              <MenuItem value="1">Low risk</MenuItem>
              <MenuItem value="2">High risk</MenuItem>
              <MenuItem value="3">Critical risk</MenuItem>
            </Select>
          </FormControl>
        )}

        {entryType === "Hospital" && (
          <>
            <input
              type="date"
              value={dischargeDate}
              onChange={(event) => setDischargeDate(event.target.value)}
            />

            <input
              placeholder="Discharge criteria"
              value={dischargeCriteria}
              onChange={(event) => setDischargeCriteria(event.target.value)}
            />
          </>
        )}

        {entryType === "OccupationalHealthcare" && (
          <>
            <input
              placeholder="Employer name"
              value={employerName}
              onChange={(event) => setEmployerName(event.target.value)}
            />

            <input
              type="date"
              value={sickLeaveStartDate}
              onChange={(event) => setSickLeaveStartDate(event.target.value)}
            />

            <input
              type="date"
              value={sickLeaveEndDate}
              onChange={(event) => setSickLeaveEndDate(event.target.value)}
            />
          </>
        )}
        <button type="submit">Add New Entry</button>
      </form>
      <Typography variant="h6">Entries</Typography>
      {patient.entries.map((entry) => (
        <div key={entry.id}>
          <p>
            {entry.date} <i>{entry.description}</i>
          </p>

          <EntryDetails entry={entry} />

          {entry.diagnosisCodes && (
            <ul>
              {entry.diagnosisCodes.map((code) => (
                <li key={code}>
                  {code}{" "}
                  {diagnoses.find((diagnosis) => diagnosis.code === code)?.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default PatientPage;
