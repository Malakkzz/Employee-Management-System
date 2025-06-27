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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Employee</h1>

      {actionData?.errors?.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
          <strong className="block font-medium mb-2">Please fix the following:</strong>
          <ul className="list-disc list-inside space-y-1">
            {actionData.errors.map((err: string, i: number) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <EmployeeForm />

      <hr className="my-8" />
      <Link to="/employees" className="text-blue-600 hover:underline">
        ← Back to Employee List
      </Link>
    </div>
  );
}
