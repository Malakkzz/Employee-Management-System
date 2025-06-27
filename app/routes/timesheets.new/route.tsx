import { useLoaderData, Form, redirect, useNavigate } from "react-router";
import { getDB } from "~/db/getDB";
import TimesheetForm from "~/components/TimesheetForm";
import type { ActionFunction } from "react-router";

export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT id, full_name FROM employees");
  return { employees, timesheet: null }; // No timesheet for new creation
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const summary = formData.get("summary")?.toString();

  // to control the format of the date when added:
  const formatDatetime = (value: string | null): string | null => {
    if (!value) return null;
    const [date, time] = value.split("T");
    return `${date} ${time}:00`;
  };
  const start_time_raw = formData.get("start_time");
  const end_time_raw = formData.get("end_time");
  // Ensure toString is only called if not null
  const start_time = formatDatetime(
    start_time_raw ? start_time_raw.toString() : null
  );
  const end_time = formatDatetime(
    end_time_raw ? end_time_raw.toString() : null
  );

  if (start_time && end_time && new Date(start_time) >= new Date(end_time)) {
    return new Response("Start time must be before end time", { status: 400 });
  }

  const db = await getDB();

  // Create a new timesheet
  await db.run(
    "INSERT INTO timesheets (employee_id, start_time, end_time, summary) VALUES (?, ?, ?, ?)",
    [employee_id, start_time, end_time, summary]
  );

  return redirect("/timesheets");
};

export default function TimesheetFormPage() {
  const { employees, timesheet } = useLoaderData();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create New Timesheet</h1>
      <TimesheetForm
        employees={employees}
        timesheet={null} // No timesheet for new creation
        submitButtonText="Create Timesheet"
      />
      <hr className="my-8" />
      <ul className="flex space-x-6 text-blue-600 underline">
        <li>
          <a href="/timesheets">📋 Timesheets</a>
        </li>
        <li>
          <a href="/employees">👥 Employees</a>
        </li>
      </ul>
    </div>
  );
}
