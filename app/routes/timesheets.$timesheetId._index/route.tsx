import { getDB } from "~/db/getDB";
import { useLoaderData, Form, redirect, useNavigate } from "react-router";
import type { ActionFunction } from "react-router";
import TimesheetForm from "~/components/TimesheetForm";

export async function loader({ params }: any) {
  const { timesheetId } = params;
  const db = await getDB();

  // Fetch the timesheet data by ID
  const timesheet = await db.get("SELECT * FROM timesheets WHERE id = ?", [
    timesheetId,
  ]);

  if (!timesheet) {
    throw new Response("Timesheet not found", { status: 404 });
  }

  const employees = await db.all("SELECT id, full_name FROM employees");

  return { timesheet, employees };
}

export const action: ActionFunction = async ({ request, params }) => {
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

  // Update the existing timesheet
  await db.run(
    "UPDATE timesheets SET employee_id = ?, start_time = ?, end_time = ?, summary = ? WHERE id = ?",
    [employee_id, start_time, end_time, summary, params.timesheetId]
  );

  return redirect("/timesheets");
};

export default function TimesheetPage() {
  const { timesheet, employees } = useLoaderData();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Update Timesheet</h1>
      <TimesheetForm
        employees={employees}
        timesheet={timesheet} // Pass the existing timesheet data
        submitButtonText="Update Timesheet"
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
