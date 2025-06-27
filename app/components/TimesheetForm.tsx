import { Form } from "react-router";

interface TimesheetFormProps {
  employees: any[];
  timesheet: any | null;
  submitButtonText: string;
}

export default function TimesheetForm({
  employees,
  timesheet,
  submitButtonText,
}: TimesheetFormProps) {
  return (
    <Form method="post" className="space-y-6 bg-white p-6 rounded-lg shadow max-w-xl mx-auto">
      <div>
        <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
          Employee
        </label>
        <select
          name="employee_id"
          id="employee_id"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          defaultValue={timesheet?.employee_id || ""}
        >
          <option disabled value="">
            -- Select Employee --
          </option>
          {employees.map((employee: any) => (
            <option key={employee.id} value={employee.id}>
              {employee.full_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
          Start Time
        </label>
        <input
          type="datetime-local"
          name="start_time"
          id="start_time"
          defaultValue={timesheet?.start_time || ""}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
          End Time
        </label>
        <input
          type="datetime-local"
          name="end_time"
          id="end_time"
          defaultValue={timesheet?.end_time || ""}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
          Summary
        </label>
        <textarea
          name="summary"
          id="summary"
          rows={3}
          defaultValue={timesheet?.summary || ""}
          placeholder="Enter a short summary..."
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {submitButtonText}
      </button>
    </Form>
  );
}
