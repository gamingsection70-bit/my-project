import { useState, useEffect } from "react";
import "./App.css";
import logo from './assets/logo.jpeg'

const PRINCIPLE_PASS = "principal123";
const STAFF_PASS = "admin123";

function App() {
  const [role, setRole] = useState("student");
  const [view, setView] = useState("login");
  const [staffRole, setStaffRole] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentBranch, setStudentBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [success, setSuccess] = useState(false);

  const [complaints, setComplaints] = useState([]);

  // Load complaints once
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("complaints") || "[]");
    setComplaints(stored);
  }, []);

  // Save complaints
  useEffect(() => {
    localStorage.setItem("complaints", JSON.stringify(complaints));
  }, [complaints]);

  const badWords = ["stupid", "idiot", "fuck", "shit"];

  const containsBadWords = (text) =>
    badWords.some((word) =>
      text.toLowerCase().includes(word)
    );

  const submitComplaint = () => {
    if (!studentBranch || !subject || !details) {
      alert("Please fill all fields.");
      return;
    }

    if (containsBadWords(details)) {
      alert("Inappropriate words detected in description.");
      return;
    }

    const newComplaint = {
      id: Date.now(),
      studentName,
      branch: studentBranch,
      subject,
      details,
      status: "Pending",
      time: new Date().toLocaleString()
    };

    const updated = [...complaints, newComplaint];
    setComplaints(updated);
    setSuccess(true);

    // Clear form instead of reload
    setStudentName("");
    setStudentBranch("");
    setSubject("");
    setDetails("");
  };

  const login = () => {
    if (staffRole === "Principle" && password === PRINCIPLE_PASS) {
      setView("principle");
      setLoginError(false);
    } else if (
      (staffRole.startsWith("CC_") ||
        staffRole.startsWith("HOD_")) &&
      password === STAFF_PASS
    ) {
      setView("staff");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const updateStatus = (id, status) => {
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, status } : c
    );
    setComplaints(updated);
  };

  const logout = () => {
    setView("login");
    setPassword("");
    setStaffRole("");
  };

  // 🔥 FIXED FILTER
  const getBranchFromRole = () => {
    if (!staffRole.includes("_")) return null;
    return staffRole.split("_")[1];
  };

  const filteredComplaints = complaints.filter(
    (c) => c.branch === getBranchFromRole()
  );

  return (
    <>
      {view === "login" && (
        <div className="container">
          <div className="logoo">
            <img src={logo} alt="" />
          </div>
          <h1 className="portal-name">
            resolve<span>X</span>
          </h1>

          <div className="role-toggle">
            <button
              className={role === "student" ? "active" : ""}
              onClick={() => setRole("student")}
            >
              Student Portal
            </button>
            <button
              className={role === "staff" ? "active" : ""}
              onClick={() => setRole("staff")}
            >
              Staff Access
            </button>
          </div>

          {role === "student" && (
            <>
              <input
                placeholder="Full Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />

              <select
                value={studentBranch}
                onChange={(e) => setStudentBranch(e.target.value)}
              >
                <option value="">Choose Branch</option>
                <option value="CSD-A">CSE - Division A</option>
                <option value="CSD-B">CSE - Division B</option>
                <option value="CSD-C">CSE - Division C</option>
                <option value="AIML">AIML</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="CV">CV</option>
                <option value="ME">ME</option>
              </select>

              <input
                placeholder="Complaint Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <textarea
                rows="4"
                placeholder="Describe your concern..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />

              <button
                onClick={submitComplaint}
                style={{ width: "100%", background: "#10b981" }}
              >
                Submit Complaint
              </button>

              {success && (
                <p className="success-msg">
                  ✓ Complaint filed successfully
                </p>
              )}
            </>
          )}

          {role === "staff" && (
            <>
              <select
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value)}
              >
                <option value="">Select Your Role</option>
                <option value="Principle">Principle</option>

                <optgroup label="HOD">
                  <option value="HOD_CSD-A">HOD - CSE (A)</option>
                  <option value="HOD_CSD-B">HOD - CSE (B)</option>
                  <option value="HOD_CSD-C">HOD - CSE (C)</option>
                  <option value="HOD_AIML">HOD - AIML</option>
                  <option value="HOD_ECE">HOD - ECE</option>
                  <option value="HOD_EEE">HOD - EEE</option>
                  <option value="HOD_CV">HOD - CV</option>
                  <option value="HOD_ME">HOD - ME</option>
                </optgroup>

                <optgroup label="CC">
                  <option value="CC_CSD-A">CC - CSE (A)</option>
                  <option value="CC_CSD-B">CC - CSE (B)</option>
                  <option value="CC_CSD-C">CC - CSE (C)</option>
                  <option value="CC_AIML">CC - AIML</option>
                  <option value="CC_ECE">CC - ECE</option>
                  <option value="CC_EEE">CC - EEE</option>
                  <option value="CC_CV">CC - CV</option>
                  <option value="CC_ME">CC - ME</option>
                </optgroup>
              </select>

              <input
                type="password"
                placeholder="Access Code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button onClick={login}>
                Authorized Login
              </button>

              {loginError && (
                <p className="error-msg">
                  Security check failed
                </p>
              )}
            </>
          )}
        </div>
      )}

      {view === "staff" && (
        <div className="container">
          <h2>{getBranchFromRole()} | Monitoring Log</h2>

          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Details</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => (
                  <tr key={c.id}>
                    <td><b>{c.studentName}</b></td>
                    <td>{c.subject}</td>
                    <td>{c.details}</td>
                    <td>{c.time}</td>
                    <td>{c.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    No records for this division.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <button className="logout-btn" onClick={logout}>
            Secure Logout
          </button>
        </div>
      )}

      {view === "principle" && (
        <div className="container">
          <h2>Central Administration</h2>

          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Branch</th>
                <th>Subject</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td><b>{c.studentName}</b></td>
                  <td>{c.branch}</td>
                  <td>{c.subject}</td>
                  <td>{c.time}</td>
                  <td>{c.status}</td>
                  <td>
                    <div className="statusbuttons">
                      <button onClick={() => updateStatus(c.id, "Approved")}>
                        Approve
                      </button>
                      <button onClick={() => updateStatus(c.id, "Pending")}>
                        Set Pending
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="logout-btn" onClick={logout}>
            Secure Logout
          </button>
        </div>
      )}
    </>
  );
}

export default App;