import { redirect, type ActionFunctionArgs } from "react-router";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getDB } from "~/db/getDB";
import EmployeeForm from "~/components/EmployeeForm";
import { useActionData, Link } from "react-router";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../public/uploads");

// we won't be using a loader function since we're not loading an existing employee

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const full_name = formData.get("full_name");
  const email = formData.get("email")?.toString() ?? "";
  const phone = formData.get("phone");
  const date_of_birth = formData.get("date_of_birth")?.toString();
  const department = formData.get("department");
  const job_title = formData.get("job_title");
  const salary = Number(formData.get("salary"));
  const start_date = formData.get("start_date")?.toString();
  const end_date = formData.get("end_date")?.toString();

  const errors: string[] = [];

  // validation just like in update 
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.push("Invalid email address");
  if (date_of_birth) {
    const age =
      new Date().getFullYear() - new Date(date_of_birth).getFullYear();
    if (age < 18) errors.push("Employee must be over 18 years old");
  }
  if (salary < 400) errors.push("Salary must be above $400");
  if (start_date && end_date && new Date(start_date) >= new Date(end_date)) {
    errors.push("Start date must be before end date");
  }

  let photo_path = null;
  let cv_path = null;

  const photoFile = formData.get("photo") as File;
  const cvFile = formData.get("cv") as File;

  await fs.mkdir(uploadsDir, { recursive: true });

  if (photoFile && photoFile.name) {
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    photo_path = `/uploads/${Date.now()}_${photoFile.name}`;
    await fs.writeFile(
      path.join(__dirname, "../../public", photo_path),
      buffer
    );
  }

  if (cvFile && cvFile.name) {
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    cv_path = `/uploads/${Date.now()}_${cvFile.name}`;
    await fs.writeFile(path.join(__dirname, "../../public", cv_path), buffer);
  }

  if (errors.length > 0) {
    return { errors };
  }

  const db = await getDB();
  await db.run(
    // inserting in the db the new fields
    `INSERT INTO employees (
      full_name, email, phone, date_of_birth, department,
      job_title, salary, start_date, end_date, photo_path, cv_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    ]
  );

  return redirect("/employees");
}

export default function NewEmployeePage() {
  const actionData = useActionData();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create New Employee</h1>

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

      <EmployeeForm />

      <hr />
      <Link to="/employees">← Back to Employee List</Link>
    </div>
  );
}
