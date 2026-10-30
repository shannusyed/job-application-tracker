import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationCard from "../components/ApplicationCard";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

const COLUMN_STYLES = {
  Applied: "bg-blue-50 border-blue-200",
  Interview: "bg-amber-50 border-amber-200",
  Offer: "bg-green-50 border-green-200",
  Rejected: "bg-red-50 border-red-200",
};

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load applications once, when the page opens
  useEffect(() => {
    async function load() {
      try {
        const data = await apiRequest("/applications");
        setApplications(data);
      } catch (err) {
        if (err.message.includes("token") || err.message.includes("logged in")) {
          handleLogout();
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  async function handleAdd(form) {
    // Remove empty fields so the backend uses its defaults
    const body = Object.fromEntries(
      Object.entries(form).filter(([, value]) => value !== "")
    );
    const created = await apiRequest("/applications", {
      method: "POST",
      body: JSON.stringify(body),
    });
    setApplications([created, ...applications]);
  }

  async function handleStatusChange(id, status) {
    try {
      const updated = await apiRequest(`/applications/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setApplications(applications.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this application?")) return;
    try {
      await apiRequest(`/applications/${id}`, { method: "DELETE" });
      setApplications(applications.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  // Search filter (runs in the browser)
  const visible = applications.filter((a) =>
    `${a.company} ${a.role}`.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const total = applications.length;
  const countOf = (status) => applications.filter((a) => a.status === status).length;
  const interviewRate = total
    ? Math.round(((countOf("Interview") + countOf("Offer")) / total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Job Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-700">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-lg"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {error && (
          <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-2xl font-bold text-slate-800">{total}</p>
          </div>
          {STATUSES.map((s) => (
            <div key={s} className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-slate-500">{s}</p>
              <p className="text-2xl font-bold text-slate-800">{countOf(s)}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Interview rate (Interview + Offer out of all applications):{" "}
          <span className="font-semibold text-slate-700">{interviewRate}%</span>
        </p>

        <ApplicationForm onAdd={handleAdd} />

        <input
          placeholder="Search by company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 border border-slate-300 rounded-lg p-2.5 text-sm mb-4 bg-white"
        />

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STATUSES.map((status) => (
              <div key={status} className={`rounded-xl border p-3 ${COLUMN_STYLES[status]}`}>
                <h2 className="font-semibold text-slate-700 mb-3">
                  {status} ({visible.filter((a) => a.status === status).length})
                </h2>
                <div className="space-y-3">
                  {visible
                    .filter((a) => a.status === status)
                    .map((a) => (
                      <ApplicationCard
                        key={a.id}
                        application={a}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;