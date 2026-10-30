import { useState } from "react";

const EMPTY = {
  company: "",
  role: "",
  status: "Applied",
  job_link: "",
  salary: "",
  notes: "",
  applied_date: "",
};

function ApplicationForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onAdd(form);
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full border border-slate-300 rounded-lg p-2.5 text-sm";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm mb-6">
      <h2 className="font-semibold text-slate-800 mb-3">Add a new application</h2>

      {error && (
        <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-3">{error}</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <input name="company" placeholder="Company *" value={form.company} onChange={handleChange} className={inputClass} />
        <input name="role" placeholder="Role *" value={form.role} onChange={handleChange} className={inputClass} />
        <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <input name="job_link" placeholder="Job link" value={form.job_link} onChange={handleChange} className={inputClass} />
        <input name="salary" placeholder="Salary (e.g. 12 LPA)" value={form.salary} onChange={handleChange} className={inputClass} />
        <input name="applied_date" type="date" value={form.applied_date} onChange={handleChange} className={inputClass} />
      </div>

      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
        rows={2}
        className={`${inputClass} mt-3`}
      />

      <button
        type="submit"
        disabled={saving}
        className="mt-3 bg-blue-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Add application"}
      </button>
    </form>
  );
}

export default ApplicationForm;