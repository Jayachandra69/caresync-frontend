import { useEffect, useState } from "react";
import Login from "./LoginPage.jsx";
import "./App.css";

// Uses .env configuration when available; otherwise defaults to Spring Boot.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:1222";

// Include the login session cookie with every backend request.
const apiFetch = (url, options = {}) =>
    fetch(url, {
        ...options,
        credentials: "include"
    });
function HospitalDashboard({ onLogout, user }) {

    const isAdmin = user?.role === "ADMIN";
    const isDoctor = user?.role === "DOCTOR";
    const isReceptionist = user?.role === "RECEPTIONIST";

    const [activePage, setActivePage] = useState("dashboard");

    // =========================================================
    // NOTIFICATION
    // =========================================================

    const [notification, setNotification] = useState(null);

    // Floating edit and delete dialogs
    const [editModal, setEditModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);

    const showNotification = (message, type = "success") => {
        setNotification({
            message,
            type
        });

        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };


    // =========================================================
    // PATIENT STATES
    // =========================================================

    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [addName, setAddName] = useState("");
    const [addAge, setAddAge] = useState("");
    const [addDisease, setAddDisease] = useState("");

    const [searchId, setSearchId] = useState("");
    const [searchedPatient, setSearchedPatient] = useState(null);

    const [updateId, setUpdateId] = useState("");
    const [updateName, setUpdateName] = useState("");
    const [updateAge, setUpdateAge] = useState("");
    const [updateDisease, setUpdateDisease] = useState("");


    // =========================================================
    // DOCTOR STATES
    // =========================================================

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [addDoctorName, setAddDoctorName] = useState("");
    const [addDoctorSpecialization, setAddDoctorSpecialization] = useState("");
    const [addDoctorExperience, setAddDoctorExperience] = useState("");

    const [searchDoctorId, setSearchDoctorId] = useState("");
    const [searchedDoctor, setSearchedDoctor] = useState(null);

    const [updateDoctorId, setUpdateDoctorId] = useState("");
    const [updateDoctorName, setUpdateDoctorName] = useState("");
    const [updateDoctorSpecialization, setUpdateDoctorSpecialization] = useState("");
    const [updateDoctorExperience, setUpdateDoctorExperience] = useState("");


    // =========================================================
    // APPOINTMENT STATES
    // =========================================================

    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [addAppointmentPatientId, setAddAppointmentPatientId] = useState("");
    const [addAppointmentDoctorId, setAddAppointmentDoctorId] = useState("");
    const [addAppointmentDate, setAddAppointmentDate] = useState("");
    const [addAppointmentTime, setAddAppointmentTime] = useState("");
    const [addAppointmentReason, setAddAppointmentReason] = useState("");
    const [addAppointmentStatus, setAddAppointmentStatus] = useState("Scheduled");

    const [searchAppointmentId, setSearchAppointmentId] = useState("");
    const [searchedAppointment, setSearchedAppointment] = useState(null);

    const [updateAppointmentId, setUpdateAppointmentId] = useState("");
    const [updateAppointmentPatientId, setUpdateAppointmentPatientId] = useState("");
    const [updateAppointmentDoctorId, setUpdateAppointmentDoctorId] = useState("");
    const [updateAppointmentDate, setUpdateAppointmentDate] = useState("");
    const [updateAppointmentTime, setUpdateAppointmentTime] = useState("");
    const [updateAppointmentReason, setUpdateAppointmentReason] = useState("");
    const [updateAppointmentStatus, setUpdateAppointmentStatus] = useState("");


    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {
        getPatients();
        getDoctors();
        getAppointments();
    }, []);


    // =========================================================
    // NAVIGATION
    // =========================================================

    const goToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };


    // =========================================================
    // PATIENT - GET ALL
    // =========================================================

    const getPatients = async () => {

        try {

            const response = await apiFetch(
                `${API_BASE_URL}/hospital/getAll`
            );

            const data = await response.json();

            setPatients(data);

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to load patients",
                "error"
            );
        }
    };


    // =========================================================
    // PATIENT - ADD
    // =========================================================

    const addPatient = async (e) => {

        e.preventDefault();

        try {

            const response = await apiFetch(
                `${API_BASE_URL}/hospital/save`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: addName,
                        age: Number(addAge),
                        disease: addDisease
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add patient");
            }

            await response.json();

            setAddName("");
            setAddAge("");
            setAddDisease("");

            await getPatients();

            showNotification(
                "Patient added successfully"
            );

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to add patient",
                "error"
            );
        }
    };


    // =========================================================
    // PATIENT - SEARCH
    // =========================================================

    const searchPatient = async () => {

        if (!searchId) {
            showNotification(
                "Enter Patient ID",
                "error"
            );
            return;
        }

        try {

            const response = await apiFetch(
                `${API_BASE_URL}/hospital/gethospital/${searchId}`
            );

            if (!response.ok) {
                throw new Error("Patient not found");
            }

            const data = await response.json();

            setSearchedPatient(data);

        } catch (error) {

            console.error(error);

            setSearchedPatient(null);

            showNotification(
                "Patient not found",
                "error"
            );
        }
    };


    // =========================================================
    // PATIENT - UPDATE
    // =========================================================

    const updatePatient = async (e) => {

        e.preventDefault();

        try {

            const response = await apiFetch(
                `${API_BASE_URL}/hospital/updatehospital/${updateId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: updateName,
                        age: Number(updateAge),
                        disease: updateDisease
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update patient");
            }

            await response.json();

            setUpdateId("");
            setUpdateName("");
            setUpdateAge("");
            setUpdateDisease("");

            await getPatients();

            setEditModal(null);

            showNotification(
                "Patient updated successfully"
            );

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to update patient",
                "error"
            );
        }
    };


    // =========================================================
    // PATIENT - DELETE
    // =========================================================

    const deletePatient = async (id) => {


        try {

            const response = await apiFetch(
                `${API_BASE_URL}/hospital/deletehospital/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete patient");
            }

            await response.text();

            await getPatients();

            setDeleteModal(null);

            showNotification(
                "Patient deleted successfully"
            );

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to delete patient",
                "error"
            );
        }
    };


    // =========================================================
    // DOCTOR - GET ALL
    // =========================================================

    const getDoctors = async () => {

        try {

            const response = await apiFetch(
                `${API_BASE_URL}/doctor/getAll`
            );

            const data = await response.json();

            setDoctors(data);

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to load doctors",
                "error"
            );
        }
    };


    // =========================================================
    // DOCTOR - ADD
    // =========================================================

    const addDoctor = async (e) => {

        e.preventDefault();

        try {

            const response = await apiFetch(
                `${API_BASE_URL}/doctor/save`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        doctorName: addDoctorName,
                        specialization: addDoctorSpecialization,
                        experience: addDoctorExperience
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add doctor");
            }

            await response.json();

            setAddDoctorName("");
            setAddDoctorSpecialization("");
            setAddDoctorExperience("");

            await getDoctors();

            showNotification(
                "Doctor added successfully"
            );

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to add doctor",
                "error"
            );
        }
    };


    // =========================================================
    // DOCTOR - SEARCH
    // =========================================================

    const searchDoctor = async () => {

        if (!searchDoctorId) {

            showNotification(
                "Enter Doctor ID",
                "error"
            );

            return;
        }

        try {

            const response = await apiFetch(
                `${API_BASE_URL}/doctor/getdoctor/${searchDoctorId}`
            );

            if (!response.ok) {
                throw new Error("Doctor not found");
            }

            const data = await response.json();

            setSearchedDoctor(data);

        } catch (error) {

            console.error(error);

            setSearchedDoctor(null);

            showNotification(
                "Doctor not found",
                "error"
            );
        }
    };


    // =========================================================
    // DOCTOR - UPDATE
    // =========================================================

    const updateDoctor = async (e) => {

        e.preventDefault();

        try {

            const response = await apiFetch(
                `${API_BASE_URL}/doctor/updatedoctor/${updateDoctorId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        doctorName: updateDoctorName,
                        specialization: updateDoctorSpecialization,
                        experience: updateDoctorExperience
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update doctor");
            }

            await response.json();

            setUpdateDoctorId("");
            setUpdateDoctorName("");
            setUpdateDoctorSpecialization("");
            setUpdateDoctorExperience("");

            await getDoctors();

            setEditModal(null);

            showNotification(
                "Doctor updated successfully"
            );

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to update doctor",
                "error"
            );
        }
    };


    // =========================================================
    // DOCTOR - DELETE
    // =========================================================

    const deleteDoctor = async (id) => {


        try {

            const response = await apiFetch(
                `${API_BASE_URL}/doctor/deletedoctor/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete doctor");
            }

            await response.text();

            await getDoctors();

            setDeleteModal(null);

            showNotification(
                "Doctor deleted successfully"
            );

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to delete doctor",
                "error"
            );
        }
    };


    // =========================================================
    // APPOINTMENT - GET ALL
    // =========================================================

    const getAppointments = async () => {

        try {

            const response = await apiFetch(
                `${API_BASE_URL}/appointment/getAll`
            );

            const data = await response.json();

            setAppointments(data);

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to load appointments",
                "error"
            );
        }
    };


    // =========================================================
    // APPOINTMENT - ADD
    // =========================================================

    const addAppointment = async (e) => {

        e.preventDefault();

        try {

            const response = await apiFetch(
                `${API_BASE_URL}/appointment/save`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        patientId: Number(addAppointmentPatientId),
                        doctorId: Number(addAppointmentDoctorId),
                        appointmentDate: addAppointmentDate,
                        appointmentTime: addAppointmentTime,
                        reason: addAppointmentReason,
                        status: addAppointmentStatus
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add appointment");
            }

            await response.json();

            setAddAppointmentPatientId("");
            setAddAppointmentDoctorId("");
            setAddAppointmentDate("");
            setAddAppointmentTime("");
            setAddAppointmentReason("");
            setAddAppointmentStatus("Scheduled");

            await getAppointments();

            showNotification(
                "Appointment added successfully"
            );

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to add appointment",
                "error"
            );
        }
    };


    // =========================================================
    // APPOINTMENT - SEARCH
    // =========================================================

    const searchAppointment = async () => {

        if (!searchAppointmentId) {

            showNotification(
                "Enter Appointment ID",
                "error"
            );

            return;
        }

        try {

            const response = await apiFetch(
                `${API_BASE_URL}/appointment/getappointment/${searchAppointmentId}`
            );

            if (!response.ok) {
                throw new Error("Appointment not found");
            }

            const data = await response.json();

            setSearchedAppointment(data);

        } catch (error) {

            console.error(error);

            setSearchedAppointment(null);

            showNotification(
                "Appointment not found",
                "error"
            );
        }
    };


    // =========================================================
    // APPOINTMENT - UPDATE
    // =========================================================

    const updateAppointment = async (e) => {

        e.preventDefault();

        try {

            const response = await apiFetch(
                `${API_BASE_URL}/appointment/updateappointment/${updateAppointmentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        patientId: Number(updateAppointmentPatientId),
                        doctorId: Number(updateAppointmentDoctorId),
                        appointmentDate: updateAppointmentDate,
                        appointmentTime: updateAppointmentTime,
                        reason: updateAppointmentReason,
                        status: updateAppointmentStatus
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update appointment");
            }

            await response.json();

            setUpdateAppointmentId("");
            setUpdateAppointmentPatientId("");
            setUpdateAppointmentDoctorId("");
            setUpdateAppointmentDate("");
            setUpdateAppointmentTime("");
            setUpdateAppointmentReason("");
            setUpdateAppointmentStatus("");

            await getAppointments();

            setEditModal(null);

            showNotification(
                "Appointment updated successfully"
            );

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to update appointment",
                "error"
            );
        }
    };


    // =========================================================
    // APPOINTMENT - DELETE
    // =========================================================

    const deleteAppointment = async (id) => {


        try {

            const response = await apiFetch(
                `${API_BASE_URL}/appointment/deleteappointment/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete appointment");
            }

            await response.text();

            await getAppointments();

            setDeleteModal(null);

            showNotification(
                "Appointment deleted successfully"
            );

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to delete appointment",
                "error"
            );
        }
    };


    // =========================================================
    // PATIENT DASHBOARD
    // =========================================================

    const totalPatients = patients.length;

    const averageAge =
        patients.length > 0
            ? (
                patients.reduce(
                    (sum, patient) =>
                        sum + Number(patient.age || 0),
                    0
                ) / patients.length
            ).toFixed(1)
            : 0;

    const diseaseCounts = {};

    patients.forEach((patient) => {

        const disease =
            patient.disease || "Unknown";

        diseaseCounts[disease] =
            (diseaseCounts[disease] || 0) + 1;
    });

    const diseaseData =
        Object.entries(diseaseCounts);

    const maximumDiseaseCount =
        Math.max(
            ...diseaseData.map(
                ([, count]) => count
            ),
            1
        );


    // =========================================================
    // PATIENT AGE ANALYTICS
    // =========================================================

    const ageGroups = {
        "0-18": 0,
        "19-30": 0,
        "31-50": 0,
        "51-70": 0,
        "71+": 0
    };

    patients.forEach((patient) => {

        const age = Number(patient.age);

        if (age <= 18) {
            ageGroups["0-18"]++;
        } else if (age <= 30) {
            ageGroups["19-30"]++;
        } else if (age <= 50) {
            ageGroups["31-50"]++;
        } else if (age <= 70) {
            ageGroups["51-70"]++;
        } else {
            ageGroups["71+"]++;
        }
    });

    const ageData =
        Object.entries(ageGroups);

    const maximumAgeCount =
        Math.max(
            ...ageData.map(
                ([, count]) => count
            ),
            1
        );


    // =========================================================
    // DOCTOR DASHBOARD
    // =========================================================

    const totalDoctors = doctors.length;

    const specializationCounts = {};

    doctors.forEach((doctor) => {

        const specialization =
            doctor.specialization || "Unknown";

        specializationCounts[specialization] =
            (specializationCounts[specialization] || 0) + 1;
    });

    const specializationData =
        Object.entries(specializationCounts);

    const maximumSpecializationCount =
        Math.max(
            ...specializationData.map(
                ([, count]) => count
            ),
            1
        );


    // =========================================================
    // APPOINTMENT DASHBOARD
    // =========================================================

    const totalAppointments =
        appointments.length;

    const scheduledAppointments =
        appointments.filter(
            appointment =>
                appointment.status === "Scheduled"
        ).length;

    const completedAppointments =
        appointments.filter(
            appointment =>
                appointment.status === "Completed"
        ).length;

    const cancelledAppointments =
        appointments.filter(
            appointment =>
                appointment.status === "Cancelled"
        ).length;


    // =========================================================
    // APPOINTMENT STATUS ANALYTICS
    // =========================================================

    const appointmentStatusData = [
        ["Scheduled", scheduledAppointments],
        ["Completed", completedAppointments],
        ["Cancelled", cancelledAppointments]
    ];

    const maximumAppointmentStatusCount =
        Math.max(
            scheduledAppointments,
            completedAppointments,
            cancelledAppointments,
            1
        );


    // =========================================================
    // START UI
    // =========================================================

    return (

        <div className="container">
            <style>{`
                .main-navigation button.nav-active {
                    background: #ccfbf1;
                    color: #115e59;
                    border: 1px solid #99f6e4;
                    font-weight: 750;
                }

                .page-transition {
                    animation: carePageEnter 0.3s ease-out;
                }

                @keyframes carePageEnter {
                    from { opacity: 0; transform: translateX(18px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .overview-heading {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 28px 0 20px;
                }

                .overview-eyebrow {
                    color: #0f766e;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 1.5px;
                }

                .overview-heading h2 {
                    margin: 8px 0;
                    border-bottom: 0;
                }

                .overview-heading p {
                    color: #64748b;
                    margin: 0;
                    line-height: 1.6;
                }

                .overview-cards {
                    margin-top: 24px;
                }

                .overview-note {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-top: 24px;
                    padding: 22px;
                    border: 1px solid #ccfbf1;
                    border-radius: 16px;
                    background: #f0fdfa;
                    color: #134e4a;
                }

                .overview-note-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    flex-shrink: 0;
                    border-radius: 12px;
                    background: #ccfbf1;
                    font-size: 22px;
                }

                .overview-note p {
                    margin: 5px 0 0;
                    color: #475569;
                    line-height: 1.6;
                }

                @media (max-width: 650px) {
                    .overview-note { align-items: flex-start; }
                }
            `}</style>

            {/* =================================================
                NOTIFICATION
            ================================================= */}

            {notification && (

                <div
                    className={`notification ${notification.type}`}
                >

                    <div className="notification-icon">
                        {notification.type === "success"
                            ? "✓"
                            : "!"}
                    </div>

                    <span>
                        {notification.message}
                    </span>

                </div>

            )}


            {/* =================================================
                HEADER
            ================================================= */}

<div className="welcome-banner" id="top-section">
    <div className="welcome-content">
        <span className="welcome-label">
            CARESYNC HEALTHCARE DASHBOARD
        </span>

        <h1>Welcome to CareSync ! 👋</h1>

        <div className="user-info">
            <span>Welcome, {user?.username}</span>
            <span className="role-badge"> — {user?.role}</span>
        </div>


        <p>
            Your healthcare overview, all in one place.
            Manage patients, doctors, and appointments with ease.
        </p>
    </div>

    <div className="welcome-date">
        <span>📅 Today</span>

        <strong>
            {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })}
        </strong>
    </div>
</div>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className="main-navigation">
                <button
                    type="button"
                    className={activePage === "dashboard" ? "nav-active" : ""}
                    onClick={() => setActivePage("dashboard")}
                >
                    🏠 Dashboard
                </button>

                <button
                    type="button"
                    className={activePage === "patients" ? "nav-active" : ""}
                    onClick={() => setActivePage("patients")}
                >
                    👥 Patients
                </button>

                <button
                    type="button"
                    className={activePage === "doctors" ? "nav-active" : ""}
                    onClick={() => setActivePage("doctors")}
                >
                    👨‍⚕️ Doctors
                </button>

                <button
                    type="button"
                    className={activePage === "appointments" ? "nav-active" : ""}
                    onClick={() => setActivePage("appointments")}
                >
                    📅 Appointments
                </button>

                <button type="button" onClick={onLogout}>
                    🚪 Logout
                </button>
            </nav>


            {activePage === "dashboard" && (
                <section key="dashboard" className="page-transition">
                    <div className="overview-heading">
                        <div>
                            <span className="overview-eyebrow">HOSPITAL OVERVIEW</span>
                            <h2>Dashboard Overview</h2>
                            <p>Here is a quick summary of your hospital today.</p>
                        </div>
                    </div>

                    <div className="dashboard overview-cards">
                        <div className="dashboard-card">
                            <div className="dashboard-icon">👥</div>
                            <div>
                                <span>Total Patients</span>
                                <strong>{totalPatients}</strong>
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <div className="dashboard-icon">👨‍⚕️</div>
                            <div>
                                <span>Total Doctors</span>
                                <strong>{totalDoctors}</strong>
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <div className="dashboard-icon">📅</div>
                            <div>
                                <span>Total Appointments</span>
                                <strong>{totalAppointments}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="overview-note">
                        <span className="overview-note-icon">✨</span>
                        <div>
                            <strong>Everything in sync</strong>
                            <p>Use the navigation above to manage patients, doctors, and appointments on separate pages.</p>
                        </div>
                    </div>
                </section>
            )}

            {activePage === "patients" && (
                <section key="patients" className="page-transition">
            {/* =================================================
                PATIENT SECTION
            ================================================= */}

            <div
                id="patient-section"
                className="section-anchor"
            ></div>


            <h2>Patient Dashboard</h2>


            <div className="dashboard">

                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        👥
                    </div>

                    <div>
                        <span>Total Patients</span>

                        <strong>
                            {totalPatients}
                        </strong>
                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        🎂
                    </div>

                    <div>
                        <span>Average Age</span>

                        <strong>
                            {averageAge}
                        </strong>
                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        🏥
                    </div>

                    <div>
                        <span>Diseases</span>

                        <strong>
                            {diseaseData.length}
                        </strong>
                    </div>

                </div>

            </div>


            {/* =================================================
                PATIENT ANALYTICS
            ================================================= */}

            <h2>Patient Analytics</h2>


            <div className="analytics-container">

                <div className="analytics-card">

                    <h3>
                        Disease Distribution
                    </h3>

                    <div className="chart">

                        {diseaseData.length === 0 ? (

                            <p>No patient data available.</p>

                        ) : (

                            diseaseData.map(
                                ([disease, count]) => (

                                    <div
                                        className="chart-row"
                                        key={disease}
                                    >

                                        <div className="chart-label">
                                            {disease}
                                        </div>

                                        <div className="chart-bar-container">

                                            <div
                                                className="disease-bar"
                                                style={{
                                                    width:
                                                        `${(count / maximumDiseaseCount) * 100}%`
                                                }}
                                            >
                                                {count}
                                            </div>

                                        </div>

                                    </div>
                                )
                            )

                        )}

                    </div>

                </div>


                <div className="analytics-card">

                    <h3>
                        Age Distribution
                    </h3>

                    <div className="chart">

                        {ageData.map(
                            ([ageGroup, count]) => (

                                <div
                                    className="chart-row"
                                    key={ageGroup}
                                >

                                    <div className="chart-label">
                                        {ageGroup}
                                    </div>

                                    <div className="chart-bar-container">

                                        <div
                                            className="age-bar"
                                            style={{
                                                width:
                                                    `${(count / maximumAgeCount) * 100}%`
                                            }}
                                        >
                                            {count}
                                        </div>

                                    </div>

                                </div>
                            )
                        )}

                    </div>

                </div>

            </div>


            {/* =================================================
                ADD PATIENT
            ================================================= */}

            {(isAdmin || isReceptionist) && (
                <>
                    <h2>Add Patient</h2>

                    <form
                        onSubmit={addPatient}
                        className="form-container"
                    >
                        <input
                            type="text"
                            placeholder="Patient Name"
                            value={addName}
                            onChange={(e) => setAddName(e.target.value)}
                            required
                        />

                        <input
                            type="number"
                            placeholder="Age"
                            value={addAge}
                            onChange={(e) => setAddAge(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Disease"
                            value={addDisease}
                            onChange={(e) => setAddDisease(e.target.value)}
                            required
                        />

                        <button type="submit">Add Patient</button>
                    </form>
                </>
            )}


            {/* =================================================
                SEARCH PATIENT
            ================================================= */}

            <h2>Search Patient</h2>

            <div className="search-container">

                <input
                    type="number"
                    placeholder="Enter Patient ID"
                    value={searchId}
                    onChange={(e) =>
                        setSearchId(e.target.value)
                    }
                />

                <button
                    type="button"
                    onClick={searchPatient}
                >
                    Search
                </button>

            </div>


            {searchedPatient && (

                <div className="search-result">

                    <h3>
                        Patient Found
                    </h3>

                    <p>
                        <strong>ID:</strong>{" "}
                        {searchedPatient.patientId}
                    </p>

                    <p>
                        <strong>Name:</strong>{" "}
                        {searchedPatient.name}
                    </p>

                    <p>
                        <strong>Age:</strong>{" "}
                        {searchedPatient.age}
                    </p>

                    <p>
                        <strong>Disease:</strong>{" "}
                        {searchedPatient.disease}
                    </p>

                </div>

            )}


            {/* =================================================
                PATIENT TABLE
            ================================================= */}

            <h2>All Patients</h2>

            <div className="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Disease</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {patients.map(
                            (patient) => (

                                <tr key={patient.patientId}>

                                    <td>
                                        {patient.patientId}
                                    </td>

                                    <td>
                                        {patient.name}
                                    </td>

                                    <td>
                                        {patient.age}
                                    </td>

                                    <td>
                                        {patient.disease}
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedPatient(
                                                    patient
                                                )
                                            }
                                        >
                                            View
                                        </button>

                                        {(isAdmin || isDoctor || isReceptionist) && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUpdateId(patient.patientId);
                                                    setUpdateName(patient.name);
                                                    setUpdateAge(patient.age);
                                                    setUpdateDisease(patient.disease);
                                                    setEditModal("patient");
                                                }}
                                            >
                                                Edit
                                            </button>
                                        )}

                                        {isAdmin && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDeleteModal({
                                                        type: "patient",
                                                        id: patient.patientId,
                                                        name: patient.name
                                                    })
                                                }
                                            >
                                                Delete
                                            </button>
                                        )}

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>


                </section>
            )}

            {activePage === "doctors" && (
                <section key="doctors" className="page-transition">
            {/* =================================================
                DOCTOR SECTION
            ================================================= */}

            <div
                id="doctor-section"
                className="section-anchor"
            ></div>


            <h2>Doctor Dashboard</h2>


            <div className="dashboard">

                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        👨‍⚕️
                    </div>

                    <div>
                        <span>Total Doctors</span>

                        <strong>
                            {totalDoctors}
                        </strong>
                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        🏥
                    </div>

                    <div>
                        <span>Specializations</span>

                        <strong>
                            {specializationData.length}
                        </strong>
                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        📋
                    </div>

                    <div>
                        <span>Appointments</span>

                        <strong>
                            {totalAppointments}
                        </strong>
                    </div>

                </div>

            </div>


            {/* =================================================
                DOCTOR ANALYTICS
            ================================================= */}

            <h2>Doctor Analytics</h2>


            <div className="analytics-container">

                <div className="analytics-card">

                    <h3>
                        Specialization Distribution
                    </h3>

                    <div className="chart">

                        {specializationData.length === 0 ? (

                            <p>
                                No doctor data available.
                            </p>

                        ) : (

                            specializationData.map(
                                ([specialization, count]) => (

                                    <div
                                        className="chart-row"
                                        key={specialization}
                                    >

                                        <div className="chart-label">
                                            {specialization}
                                        </div>

                                        <div className="chart-bar-container">

                                            <div
                                                className="disease-bar"
                                                style={{
                                                    width:
                                                        `${(count / maximumSpecializationCount) * 100}%`
                                                }}
                                            >
                                                {count}
                                            </div>

                                        </div>

                                    </div>
                                )
                            )

                        )}

                    </div>

                </div>


                <div className="analytics-card">

                    <h3>
                        Doctor Summary
                    </h3>

                    <div className="appointment-summary">

                        <div>

                            <span>
                                Total Doctors
                            </span>

                            <strong>
                                {totalDoctors}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Specializations
                            </span>

                            <strong>
                                {specializationData.length}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                ADD DOCTOR
            ================================================= */}

            {isAdmin && (
                <>
                    <h2>Add Doctor</h2>

                    <form onSubmit={addDoctor} className="form-container">
                        <input
                            type="text"
                            placeholder="Doctor Name"
                            value={addDoctorName}
                            onChange={(e) => setAddDoctorName(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Specialization"
                            value={addDoctorSpecialization}
                            onChange={(e) => setAddDoctorSpecialization(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Experience"
                            value={addDoctorExperience}
                            onChange={(e) => setAddDoctorExperience(e.target.value)}
                            required
                        />

                        <button type="submit">Add Doctor</button>
                    </form>
                </>
            )}


            {/* =================================================
                SEARCH DOCTOR
            ================================================= */}

            <h2>Search Doctor</h2>

            <div className="search-container">

                <input
                    type="number"
                    placeholder="Enter Doctor ID"
                    value={searchDoctorId}
                    onChange={(e) =>
                        setSearchDoctorId(e.target.value)
                    }
                />

                <button
                    type="button"
                    onClick={searchDoctor}
                >
                    Search
                </button>

            </div>


            {searchedDoctor && (

                <div className="search-result">

                    <h3>
                        Doctor Found
                    </h3>

                    <p>
                        <strong>ID:</strong>{" "}
                        {searchedDoctor.doctorId}
                    </p>

                    <p>
                        <strong>Name:</strong>{" "}
                        {searchedDoctor.doctorName}
                    </p>

                    <p>
                        <strong>Specialization:</strong>{" "}
                        {searchedDoctor.specialization}
                    </p>

                    <p>
                        <strong>Experience:</strong>{" "}
                        {searchedDoctor.experience}
                    </p>

                </div>

            )}


            {/* =================================================
                DOCTOR TABLE
            ================================================= */}

            <h2>All Doctors</h2>

            <div className="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Name</th>
                            <th>Specialization</th>
                            <th>Experience</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {doctors.map(
                            (doctor) => (

                                <tr key={doctor.doctorId}>

                                    <td>
                                        {doctor.doctorId}
                                    </td>

                                    <td>
                                        {doctor.doctorName}
                                    </td>

                                    <td>
                                        {doctor.specialization}
                                    </td>

                                    <td>
                                        {doctor.experience}
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedDoctor(
                                                    doctor
                                                )
                                            }
                                        >
                                            View
                                        </button>

                                        {isAdmin && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUpdateDoctorId(doctor.doctorId);
                                                    setUpdateDoctorName(doctor.doctorName);
                                                    setUpdateDoctorSpecialization(doctor.specialization);
                                                    setUpdateDoctorExperience(doctor.experience);
                                                    setEditModal("doctor");
                                                }}
                                            >
                                                Edit
                                            </button>
                                        )}

                                        {isAdmin && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDeleteModal({
                                                        type: "doctor",
                                                        id: doctor.doctorId,
                                                        name: doctor.doctorName
                                                    })
                                                }
                                            >
                                                Delete
                                            </button>
                                        )}

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>


                </section>
            )}

            {activePage === "appointments" && (
                <section key="appointments" className="page-transition">
            {/* =================================================
                APPOINTMENT SECTION
            ================================================= */}

            <div
                id="appointment-section"
                className="section-anchor"
            ></div>


            <h2>Appointment Dashboard</h2>


            <div className="dashboard appointment-dashboard">

                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        📅
                    </div>

                    <div>

                        <span>
                            Total Appointments
                        </span>

                        <strong>
                            {totalAppointments}
                        </strong>

                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        🟢
                    </div>

                    <div>

                        <span>
                            Scheduled
                        </span>

                        <strong>
                            {scheduledAppointments}
                        </strong>

                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        ✅
                    </div>

                    <div>

                        <span>
                            Completed
                        </span>

                        <strong>
                            {completedAppointments}
                        </strong>

                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        ❌
                    </div>

                    <div>

                        <span>
                            Cancelled
                        </span>

                        <strong>
                            {cancelledAppointments}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                APPOINTMENT ANALYTICS
            ================================================= */}

            <h2>Appointment Analytics</h2>


            <div className="analytics-container">

                <div className="analytics-card">

                    <h3>
                        Appointment Status Distribution
                    </h3>

                    <div className="chart">

                        {appointmentStatusData.map(
                            ([status, count]) => (

                                <div
                                    className="chart-row"
                                    key={status}
                                >

                                    <div className="chart-label">
                                        {status}
                                    </div>

                                    <div className="chart-bar-container">

                                        <div
                                            className="appointment-bar"
                                            style={{
                                                width:
                                                    `${(count / maximumAppointmentStatusCount) * 100}%`
                                            }}
                                        >
                                            {count}
                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>


                <div className="analytics-card">

                    <h3>
                        Appointment Summary
                    </h3>

                    <div className="appointment-summary">

                        <div>

                            <span>
                                Total
                            </span>

                            <strong>
                                {totalAppointments}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Scheduled
                            </span>

                            <strong>
                                {scheduledAppointments}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Completed
                            </span>

                            <strong>
                                {completedAppointments}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Cancelled
                            </span>

                            <strong>
                                {cancelledAppointments}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                ADD APPOINTMENT
            ================================================= */}

            <h2>Appointments</h2>

            {(isAdmin || isReceptionist) && (
                <>
                    <h2>Add Appointment</h2>

                    <form onSubmit={addAppointment} className="form-container">
                        <input type="number" placeholder="Patient ID" value={addAppointmentPatientId} onChange={(e) => setAddAppointmentPatientId(e.target.value)} required />
                        <input type="number" placeholder="Doctor ID" value={addAppointmentDoctorId} onChange={(e) => setAddAppointmentDoctorId(e.target.value)} required />
                        <input type="date" value={addAppointmentDate} onChange={(e) => setAddAppointmentDate(e.target.value)} required />
                        <input type="time" value={addAppointmentTime} onChange={(e) => setAddAppointmentTime(e.target.value)} required />
                        <input type="text" placeholder="Reason" value={addAppointmentReason} onChange={(e) => setAddAppointmentReason(e.target.value)} required />
                        <select value={addAppointmentStatus} onChange={(e) => setAddAppointmentStatus(e.target.value)}>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <button type="submit">Add Appointment</button>
                    </form>
                </>
            )}


            {/* =================================================
                SEARCH APPOINTMENT
            ================================================= */}

            <h2>Search Appointment</h2>

            <div className="search-container">

                <input
                    type="number"
                    placeholder="Enter Appointment ID"
                    value={searchAppointmentId}
                    onChange={(e) =>
                        setSearchAppointmentId(
                            e.target.value
                        )
                    }
                />

                <button
                    type="button"
                    onClick={searchAppointment}
                >
                    Search
                </button>

            </div>


            {searchedAppointment && (

                <div className="search-result">

                    <h3>
                        Appointment Found
                    </h3>

                    <p>
                        <strong>ID:</strong>{" "}
                        {searchedAppointment.appointmentId}
                    </p>

                    <p>
                        <strong>Patient ID:</strong>{" "}
                        {searchedAppointment.patientId}
                    </p>

                    <p>
                        <strong>Doctor ID:</strong>{" "}
                        {searchedAppointment.doctorId}
                    </p>

                    <p>
                        <strong>Date:</strong>{" "}
                        {searchedAppointment.appointmentDate}
                    </p>

                    <p>
                        <strong>Time:</strong>{" "}
                        {searchedAppointment.appointmentTime}
                    </p>

                    <p>
                        <strong>Reason:</strong>{" "}
                        {searchedAppointment.reason}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {searchedAppointment.status}
                    </p>

                </div>

            )}


            {/* =================================================
                APPOINTMENT TABLE
            ================================================= */}

            <h2>All Appointments</h2>

            <div className="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Patient ID</th>
                            <th>Doctor ID</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {appointments.map(
                            (appointment) => (

                                <tr
                                    key={
                                        appointment.appointmentId
                                    }
                                >

                                    <td>
                                        {
                                            appointment.appointmentId
                                        }
                                    </td>

                                    <td>
                                        {
                                            appointment.patientId
                                        }
                                    </td>

                                    <td>
                                        {
                                            appointment.doctorId
                                        }
                                    </td>

                                    <td>
                                        {
                                            appointment.appointmentDate
                                        }
                                    </td>

                                    <td>
                                        {
                                            appointment.appointmentTime
                                        }
                                    </td>

                                    <td>
                                        {
                                            appointment.reason
                                        }
                                    </td>

                                    <td>
                                        {
                                            appointment.status
                                        }
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedAppointment(
                                                    appointment
                                                )
                                            }
                                        >
                                            View
                                        </button>

                                        {(isAdmin || isDoctor) && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUpdateAppointmentId(appointment.appointmentId);
                                                    setUpdateAppointmentPatientId(appointment.patientId);
                                                    setUpdateAppointmentDoctorId(appointment.doctorId);
                                                    setUpdateAppointmentDate(appointment.appointmentDate);
                                                    setUpdateAppointmentTime(appointment.appointmentTime);
                                                    setUpdateAppointmentReason(appointment.reason);
                                                    setUpdateAppointmentStatus(appointment.status);
                                                    setEditModal("appointment");
                                                }}
                                            >
                                                Edit
                                            </button>
                                        )}

                                        {isAdmin && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDeleteModal({
                                                        type: "appointment",
                                                        id: appointment.appointmentId,
                                                        name: `Appointment #${appointment.appointmentId}`
                                                    })
                                                }
                                            >
                                                Delete
                                            </button>
                                        )}

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>


                </section>
            )}

            {/* =================================================
                FLOATING EDIT MODAL
            ================================================= */}

            {editModal && (
                <div
                    className="modal-overlay edit-overlay"
                    onClick={() => setEditModal(null)}
                >
                    <div
                        className="edit-modal-card"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="edit-modal-header">
                            <div>
                                <span className="edit-modal-eyebrow">CARESYNC</span>
                                <h2 id="edit-modal-title">
                                    Edit {editModal === "patient" ? "Patient" : editModal === "doctor" ? "Doctor" : "Appointment"}
                                </h2>
                                <p>Update the details below and save your changes.</p>
                            </div>
                            <button
                                type="button"
                                className="edit-modal-x"
                                aria-label="Close edit window"
                                onClick={() => setEditModal(null)}
                            >
                                ×
                            </button>
                        </div>

                        {editModal === "patient" && (
                            <form className="edit-modal-form" onSubmit={updatePatient}>
                                <label>Patient ID
                                    <input type="text" value={updateId} readOnly />
                                </label>
                                <label>Patient name
                                    <input type="text" value={updateName} onChange={(e) => setUpdateName(e.target.value)} required />
                                </label>
                                <label>Age
                                    <input type="number" min="0" value={updateAge} onChange={(e) => setUpdateAge(e.target.value)} required />
                                </label>
                                <label>Disease / condition
                                    <input type="text" value={updateDisease} onChange={(e) => setUpdateDisease(e.target.value)} required />
                                </label>
                                <div className="edit-modal-actions">
                                    <button type="button" className="secondary-modal-button" onClick={() => setEditModal(null)}>Cancel</button>
                                    <button type="submit" className="primary-modal-button">Save changes</button>
                                </div>
                            </form>
                        )}

                        {editModal === "doctor" && (
                            <form className="edit-modal-form" onSubmit={updateDoctor}>
                                <label>Doctor ID
                                    <input type="text" value={updateDoctorId} readOnly />
                                </label>
                                <label>Doctor name
                                    <input type="text" value={updateDoctorName} onChange={(e) => setUpdateDoctorName(e.target.value)} required />
                                </label>
                                <label>Specialization
                                    <input type="text" value={updateDoctorSpecialization} onChange={(e) => setUpdateDoctorSpecialization(e.target.value)} required />
                                </label>
                                <label>Experience
                                    <input type="text" value={updateDoctorExperience} onChange={(e) => setUpdateDoctorExperience(e.target.value)} required />
                                </label>
                                <div className="edit-modal-actions">
                                    <button type="button" className="secondary-modal-button" onClick={() => setEditModal(null)}>Cancel</button>
                                    <button type="submit" className="primary-modal-button">Save changes</button>
                                </div>
                            </form>
                        )}

                        {editModal === "appointment" && (
                            <form className="edit-modal-form" onSubmit={updateAppointment}>
                                <label>Appointment ID
                                    <input type="text" value={updateAppointmentId} readOnly />
                                </label>
                                <div className="edit-modal-two-columns">
                                    <label>Patient ID
                                        <input type="number" min="1" value={updateAppointmentPatientId} onChange={(e) => setUpdateAppointmentPatientId(e.target.value)} required />
                                    </label>
                                    <label>Doctor ID
                                        <input type="number" min="1" value={updateAppointmentDoctorId} onChange={(e) => setUpdateAppointmentDoctorId(e.target.value)} required />
                                    </label>
                                </div>
                                <div className="edit-modal-two-columns">
                                    <label>Date
                                        <input type="date" value={updateAppointmentDate} onChange={(e) => setUpdateAppointmentDate(e.target.value)} required />
                                    </label>
                                    <label>Time
                                        <input type="time" value={updateAppointmentTime} onChange={(e) => setUpdateAppointmentTime(e.target.value)} required />
                                    </label>
                                </div>
                                <label>Reason
                                    <input type="text" value={updateAppointmentReason} onChange={(e) => setUpdateAppointmentReason(e.target.value)} required />
                                </label>
                                <label>Status
                                    <select value={updateAppointmentStatus} onChange={(e) => setUpdateAppointmentStatus(e.target.value)} required>
                                        <option value="">Select status</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </label>
                                <div className="edit-modal-actions">
                                    <button type="button" className="secondary-modal-button" onClick={() => setEditModal(null)}>Cancel</button>
                                    <button type="submit" className="primary-modal-button">Save changes</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}


            {/* =================================================
                FLOATING DELETE CONFIRMATION
            ================================================= */}

            {deleteModal && (
                <div
                    className="modal-overlay edit-overlay"
                    onClick={() => setDeleteModal(null)}
                >
                    <div
                        className="delete-modal-card"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="delete-modal-icon">!</div>
                        <h2 id="delete-modal-title">Confirm deletion</h2>
                        <p>
                            Are you sure you want to delete <strong>{deleteModal.name}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="edit-modal-actions">
                            <button type="button" className="secondary-modal-button" onClick={() => setDeleteModal(null)}>Cancel</button>
                            <button
                                type="button"
                                className="danger-modal-button"
                                onClick={() => {
                                    if (deleteModal.type === "patient") deletePatient(deleteModal.id);
                                    if (deleteModal.type === "doctor") deleteDoctor(deleteModal.id);
                                    if (deleteModal.type === "appointment") deleteAppointment(deleteModal.id);
                                }}
                            >
                                Yes, delete
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* =================================================
                PATIENT MODAL
            ================================================= */}

            {selectedPatient && (

                <div className="modal-overlay">

                    <div className="patient-modal">

                        <div className="modal-header">

                            <h2>
                                Patient Details
                            </h2>

                            <button
                                className="close-button"
                                type="button"
                                onClick={() =>
                                    setSelectedPatient(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="modal-body">

                            <div className="detail-row">

                                <strong>
                                    Patient ID
                                </strong>

                                <span>
                                    {
                                        selectedPatient.patientId
                                    }
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Name
                                </strong>

                                <span>
                                    {
                                        selectedPatient.name
                                    }
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Age
                                </strong>

                                <span>
                                    {
                                        selectedPatient.age
                                    }
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Disease
                                </strong>

                                <span>
                                    {
                                        selectedPatient.disease
                                    }
                                </span>

                            </div>


                            <button
                                className="modal-close-button"
                                type="button"
                                onClick={() =>
                                    setSelectedPatient(null)
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                DOCTOR MODAL
            ================================================= */}

            {selectedDoctor && (

                <div className="modal-overlay">

                    <div className="patient-modal">

                        <div className="modal-header">

                            <h2>
                                Doctor Details
                            </h2>

                            <button
                                className="close-button"
                                type="button"
                                onClick={() =>
                                    setSelectedDoctor(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="modal-body">

                            <div className="detail-row">

                                <strong>
                                    Doctor ID
                                </strong>

                                <span>
                                    {
                                        selectedDoctor.doctorId
                                    }
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Doctor Name
                                </strong>

                                <span>
                                    {
                                        selectedDoctor.doctorName
                                    }
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Specialization
                                </strong>

                                <span>
                                    {
                                        selectedDoctor.specialization
                                    }
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Experience
                                </strong>

                                <span>
                                    {
                                        selectedDoctor.experience
                                    }
                                </span>

                            </div>


                            <button
                                className="modal-close-button"
                                type="button"
                                onClick={() =>
                                    setSelectedDoctor(null)
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                APPOINTMENT MODAL
            ================================================= */}

            {selectedAppointment && (

                <div className="modal-overlay">

                    <div className="patient-modal">

                        <div className="modal-header">

                            <h2>
                                Appointment Details
                            </h2>

                            <button
                                className="close-button"
                                type="button"
                                onClick={() =>
                                    setSelectedAppointment(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="modal-body">

                            <div className="detail-row">

                                <strong>
                                    Appointment ID
                                </strong>

                                <span>
                                    {
                                        selectedAppointment.appointmentId
                                    }
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Patient ID
                                </strong>

                                <span>
                                    {
                                        selectedAppointment.patientId
                                    }
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Doctor ID
                                </strong>

                                <span>
                                    {
                                        selectedAppointment.doctorId
                                    }
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Date
                                </strong>

                                <span>
                                    {
                                        selectedAppointment.appointmentDate
                                    }
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Time
                                </strong>

                                <span>
                                    {
                                        selectedAppointment.appointmentTime
                                    }
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Reason
                                </strong>

                                <span>
                                    {
                                        selectedAppointment.reason
                                    }
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Status
                                </strong>

                                <span>
                                    {
                                        selectedAppointment.status
                                    }
                                </span>

                            </div>


                            <button
                                className="modal-close-button"
                                type="button"
                                onClick={() =>
                                    setSelectedAppointment(null)
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

function App() {
    const [user, setUser] = useState(null);

    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout request failed:", error);
        } finally {
            setUser(null);
        }
    };

    if (!user) {
        return <Login onLogin={(userData) => setUser(userData)} />;
    }

    return (
        <HospitalDashboard
            onLogout={handleLogout}
            user={user}
        />
    );
}

export default App;