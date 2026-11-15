
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Activity, Users, UserPlus, Search, RefreshCw,
  HeartPulse, Pencil, Trash2, X, Save, AlertCircle
} from "lucide-react";
import "./App.css";

const API = "http://127.0.0.1:8000/api/patients/";

const emptyForm = {
  full_name: "",
  date_of_birth: "",
  email: "",
  glucose: "",
  haemoglobin: "",
  cholesterol: "",
};

function App() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPatients = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(API);
      setPatients(response.data);
    } catch {
      setError("Could not connect to the backend. Please check that FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const openEditForm = (patient) => {
    setForm({
      full_name: patient.full_name,
      date_of_birth: patient.date_of_birth,
      email: patient.email,
      glucose: patient.glucose,
      haemoglobin: patient.haemoglobin,
      cholesterol: patient.cholesterol,
    });
    setEditingId(patient.id);
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      ...form,
      glucose: Number(form.glucose),
      haemoglobin: Number(form.haemoglobin),
      cholesterol: Number(form.cholesterol),
    };

    try {
      if (editingId) {
        await axios.put(`${API}${editingId}`, payload);
        setMessage("Patient details updated successfully.");
      } else {
        await axios.post(API, payload);
        setMessage("Patient added successfully.");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadPatients();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        Array.isArray(detail)
          ? detail.map((item) => item.msg).join(", ")
          : detail || "Something went wrong. Please try again."
      );
    }
  };

  const handleDelete = async (patient) => {
    if (!window.confirm(`Delete ${patient.full_name}? This cannot be undone.`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await axios.delete(`${API}${patient.id}`);
      setMessage("Patient deleted successfully.");
      await loadPatients();
    } catch {
      setError("Unable to delete this patient.");
    }
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.full_name} ${patient.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><HeartPulse size={25} /></div>
          <div>
            <h2>HealthPredict</h2>
            <span>AI HEALTH PLATFORM</span>
          </div>
        </div>

        <div className="nav-label">MAIN MENU</div>
        <div className="nav-item active">
          <Activity size={19} /> Dashboard
        </div>
        <div className="nav-item">
          <Users size={19} /> Patients
        </div>

        <div className="sidebar-bottom">
          <div className="status-dot"></div>
          <span>HealthPredict AI</span>
          <small>v1.0.0</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">HEALTH MANAGEMENT</p>
            <h1>Dashboard</h1>
          </div>
          <button className="primary-button" onClick={openAddForm}>
            <UserPlus size={18} /> Add Patient
          </button>
        </header>

        <section className="welcome-section">
          <div>
            <span className="welcome-tag">AI-POWERED HEALTH INSIGHTS</span>
            <h2>Patient Overview</h2>
            <p>Manage patient records and review AI-generated health observations.</p>
          </div>
          <div className="welcome-icon"><HeartPulse size={48} /></div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple"><Users size={22} /></div>
            <span>Total Patients</span>
            <h2>{patients.length}</h2>
            <small>Registered records</small>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><Activity size={22} /></div>
            <span>AI Assessments</span>
            <h2>{patients.filter(p => p.remarks && !p.remarks.toLowerCase().includes("unavailable")).length}</h2>
            <small>Records with AI remarks</small>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><HeartPulse size={22} /></div>
            <span>Health Metrics</span>
            <h2>03</h2>
            <small>Blood parameters tracked</small>
          </div>
        </section>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message"><AlertCircle size={18} /> {error}</div>}

        <section className="table-section">
          <div className="table-heading">
            <div>
              <h2>Patient Records</h2>
              <p>View and manage registered patient information</p>
            </div>
            <button className="refresh-button" onClick={loadPatients} title="Refresh">
              <RefreshCw size={17} />
            </button>
          </div>

          <div className="table-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                placeholder="Search by patient name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="record-count">{filteredPatients.length} records</span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>PATIENT</th>
                  <th>DATE OF BIRTH</th>
                  <th>GLUCOSE</th>
                  <th>HAEMOGLOBIN</th>
                  <th>CHOLESTEROL</th>
                  <th>AI REMARKS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="empty-state">Loading patient records...</td></tr>
                ) : filteredPatients.length === 0 ? (
                  <tr><td colSpan="7" className="empty-state">No patient records found.</td></tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>
                        <div className="patient-name">{patient.full_name}</div>
                        <div className="patient-email">{patient.email}</div>
                      </td>
                      <td>{formatDate(patient.date_of_birth)}</td>
                      <td>{patient.glucose}</td>
                      <td>{patient.haemoglobin}</td>
                      <td>{patient.cholesterol}</td>
                      <td>
  <span className="remarks-badge">
    {patient.remarks ? "AI Generated" : "Pending"}
  </span>
  <div className="patient-email">
    {patient.remarks || "No assessment available"}
  </div>
</td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-button" onClick={() => openEditForm(patient)} title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button className="delete-button" onClick={() => handleDelete(patient)} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer>© 2026 HealthPredict AI · Patient Health Management System</footer>
      </main>

      {showForm && (
        <div className="modal-overlay">
          <div className="patient-modal">
            <div className="modal-heading">
              <div>
                <h2>{editingId ? "Edit Patient" : "Add New Patient"}</h2>
                <p>Enter patient details and blood test results</p>
              </div>
              <button className="close-button" onClick={() => setShowForm(false)}>
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Full Name
                <input name="full_name" value={form.full_name} onChange={handleChange} required minLength="2" />
              </label>

              <label>Date of Birth
                <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} required max={new Date().toISOString().split("T")[0]} />
              </label>

              <label>Email Address
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>

              <div className="form-divider">BLOOD TEST RESULTS</div>

              <div className="form-grid">
                <label>Glucose
                  <input type="number" name="glucose" value={form.glucose} onChange={handleChange} min="0.01" step="any" required />
                </label>
                <label>Haemoglobin
                  <input type="number" name="haemoglobin" value={form.haemoglobin} onChange={handleChange} min="0.01" step="any" required />
                </label>
                <label>Cholesterol
                  <input type="number" name="cholesterol" value={form.cholesterol} onChange={handleChange} min="0.01" step="any" required />
                </label>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="primary-button">
                  <Save size={17} /> {editingId ? "Save Changes" : "Add Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
