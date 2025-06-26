import { Form } from "react-router";

interface TimesheetFormProps {
  employees: any[];
  timesheet: any | null;
  submitButtonText: string;
}

export default function TimesheetForm({ employees, timesheet, submitButtonText }: TimesheetFormProps) {
  return (
    <Form method="post">
      <div>
        <label htmlFor="employee_id">Employee</label>
        <select name="employee_id" id="employee_id" required>
          {employees.map((employee: any) => (
            <option
              key={employee.id}
              value={employee.id}
              selected={timesheet?.employee_id === employee.id}
            >
              {employee.full_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="start_time">Start Time</label>
        <input
          type="datetime-local"
          name="start_time"
          id="start_time"
          defaultValue={timesheet?.start_time || ''}
          required
        />
      </div>
      <div>
        <label htmlFor="end_time">End Time</label>
        <input
          type="datetime-local"
          name="end_time"
          id="end_time"
          defaultValue={timesheet?.end_time || ''}
          required
        />
      </div>
      <button type="submit">{submitButtonText}</button>
    </Form>
  );
}
