// form component used to create or update an employee
//will be reused in both /employees/new and /employees/:id
import { Form } from "react-router";

//defaultValues: an object with employee data
export default function EmployeeForm({
  defaultValues,
}: {
  defaultValues?: any;
}) {
  const employee = defaultValues || {};

  return (
    <Form
      method="post"
      encType="multipart/form-data" //required to send file uploads
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      {/* LEFT COLUMN */}
      <div>
        <label>Full Name *</label>
        <br />
        <input
          name="full_name"
          type="text"
          defaultValue={employee.full_name || ""}
          required
        />
      </div>

      <div>
        <label>Email *</label>
        <br />
        <input
          name="email"
          type="email"
          defaultValue={employee.email || ""}
          required
        />
      </div>

      <div>
        <label>Phone</label>
        <br />
        <input name="phone" type="tel" defaultValue={employee.phone || ""} />
      </div>

      <div>
        <label>Date of Birth *</label>
        <br />
        <input
          name="date_of_birth"
          type="date"
          defaultValue={employee.date_of_birth || ""}
          required
        />
      </div>

      <div>
        <label>Department</label>
        <br />
        <input
          name="department"
          type="text"
          defaultValue={employee.department || ""}
        />
      </div>

      <div>
        <label>Job Title</label>
        <br />
        <input
          name="job_title"
          type="text"
          defaultValue={employee.job_title || ""}
        />
      </div>

      <div>
        <label>Salary ($) *</label>
        <br />
        <input
          name="salary"
          type="number"
          min="0"
          defaultValue={employee.salary || ""}
          required
        />
      </div>

      <div>
        <label>Start Date</label>
        <br />
        <input
          name="start_date"
          type="date"
          defaultValue={employee.start_date || ""}
        />
      </div>

      <div>
        <label>End Date</label>
        <br />
        <input
          name="end_date"
          type="date"
          defaultValue={employee.end_date || ""}
        />
      </div>

      {/* FILE UPLOADS */}
      <div>
        <label>Employee Photo (jpg/png)</label>
        <br />
        <input type="file" name="photo" accept="image/*" />
      </div>

      <div>
        <label>CV (PDF/DOC)</label>
        <br />
        <input type="file" name="cv" accept=".pdf,.doc,.docx" />
      </div>

      {/* Submit */}
      <div style={{ gridColumn: "span 2" }}>
        <button type="submit">💾 Save</button>
      </div>
    </Form>
  );
}
