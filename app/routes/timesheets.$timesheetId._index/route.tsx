import { getDB } from "~/db/getDB";
import { useLoaderData, Form, redirect, useNavigate } from "react-router";
import type { ActionFunction } from "react-router";
import TimesheetForm from "~/components/TimesheetForm";

export async function loader({ params }: any) {
  const { timesheetId } = params;
  const db = await getDB();
  
  // Fetch the timesheet data by ID
  const timesheet = await db.get('SELECT * FROM timesheets WHERE id = ?', [timesheetId]);

  if (!timesheet) {
    throw new Response("Timesheet not found", { status: 404 });
  }

  const employees = await db.all('SELECT id, full_name FROM employees');

  return { timesheet, employees };
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");

  const db = await getDB();

  // Update the existing timesheet
  await db.run(
    'UPDATE timesheets SET employee_id = ?, start_time = ?, end_time = ? WHERE id = ?',
    [employee_id, start_time, end_time, params.timesheetId]
  );

  return redirect("/timesheets");
}

export default function TimesheetPage() {
  const { timesheet, employees } = useLoaderData();

  return (
    <div>
      <h1>Update Timesheet</h1>
      <TimesheetForm
        employees={employees}
        timesheet={timesheet}  // Pass the existing timesheet data
        submitButtonText="Update Timesheet"
      />
      <hr />
      <ul>
        <li><a href="/timesheets">Timesheets</a></li>
        <li><a href="/employees">Employees</a></li>
      </ul>
    </div>
  );
}
