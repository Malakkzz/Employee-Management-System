import {
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useActionData,
} from "react-router";
import { getDB } from "~/db/getDB";
import { useLoaderData, Link } from "react-router";
import EmployeeForm from "~/components/EmployeeForm";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../public/uploads");


// fetches the employee by id from the database
export async function loader({ params }: LoaderFunctionArgs) {
  const db = await getDB();
  const employee = await db.get(
    "SELECT * FROM employees WHERE id = ?",
    params.employeeId
  );

  if (!employee) {
    throw new Response("Employee not found", { status: 404 });
  }

  return { employee };
}

export async function action({ request, params }: ActionFunctionArgs) {

  const formData = await request.formData(); // collects submitted data and files

  const full_name = formData.get("full_name");
  const email = formData.get("email")?.toString() ?? "";
  const phone = formData.get("phone");
  const date_of_birth = formData.get("date_of_birth")?.toString();
  const department = formData.get("department");
  const job_title = formData.get("job_title");
  const salary = Number(formData.get("salary"));
  const start_date = formData.get("start_date")?.toString();
  const end_date = formData.get("end_date")?.toString();

  const db = await getDB();
  const errors: string[] = [];

  //age validation
  if (date_of_birth) {
    const age =
      new Date().getFullYear() - new Date(date_of_birth).getFullYear();
    if (age < 18) errors.push("Employee must be over 18 years old");
  }

  //email format
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("Invalid email address");
  }

  //minimum salary
  if (salary < 400) {
    errors.push("Salary must be above $400");
  }

  //start date < end date
  if (start_date && end_date && new Date(start_date) >= new Date(end_date)) {
    errors.push("Start date must be before end date");
  }

  if (errors.length > 0) {
    return { errors };
  }

  //file uploads(image and cv)
  await fs.mkdir(uploadsDir, { recursive: true });

  const photoFile = formData.get("photo") as File;
  const cvFile = formData.get("cv") as File;

  let photo_path = null;
  let cv_path = null;

  // saves uploaded files to public/uploads/
  // names them with a timestamp prefix to avoid duplicates
  // stores the relative path in the database
  if (photoFile && photoFile.name) {
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    photo_path = `/uploads/${Date.now()}_${photoFile.name}`;
    await fs.writeFile(
      path.join(__dirname, "../../public", photo_path),
      photoBuffer
    );
  }

  if (cvFile && cvFile.name) {
    const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
    cv_path = `/uploads/${Date.now()}_${cvFile.name}`;
    await fs.writeFile(path.join(__dirname, "../../public", cv_path), cvBuffer);
  }


  // saving to the database
  await db.run(

    // updates the employee fields
    // COALESCE: if the user doesn't re-upload a file, the old one stays unchanged
    `UPDATE employees SET
      full_name = ?, email = ?, phone = ?, date_of_birth = ?, department = ?,
      job_title = ?, salary = ?, start_date = ?, end_date = ?,
      photo_path = COALESCE(?, photo_path), cv_path = COALESCE(?, cv_path)
     WHERE id = ?`,
    [
      full_name,
      email,
      phone,
      date_of_birth,
      department,
      job_title,
      salary,
      start_date,
      end_date,
      photo_path,
      cv_path,
      params.employeeId,
    ]
  );

  return redirect("/employees");
}

export default function EmployeePage() {
  const { employee } = useLoaderData(); // loads the employee from the loader
  const actionData = useActionData(); // captures validation errors

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Edit Employee #{employee.id}</h1>

      {/* show error messages */}
      {actionData?.errors?.length > 0 && (
        <div
          style={{
            backgroundColor: "#ffe0e0",
            border: "1px solid red",
            padding: "1rem",
            marginBottom: "1rem",
            color: "darkred",
          }}
        >
          <strong>Please fix the following:</strong>
          <ul>
            {actionData.errors.map((err: string, i: number) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <EmployeeForm defaultValues={employee} />

      <hr />
      <Link to="/employees">← Back to Employees</Link>
    </div>
  );
}
