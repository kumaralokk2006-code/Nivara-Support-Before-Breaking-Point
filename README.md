# Nivara — Early Student Support & Well-being Ecosystem
**Backend Service (SIH 2025/2026 PS-29)**  
*Support before the breaking point.*

Nivara is an explainable, consent-first student support backend designed to identify students who may need **Academic, Financial, or Well-being support** using minimal consented data, explain every recommendation, provide supportive non-punitive intervention pathways, and monitor fairness across campus cohorts.

---

## 🌟 Core Pillars & Key Differentiators

1. **Three-Dimensional Support**: Academic, Financial, and Well-being support unified under a single Support Need Profile.
2. **Support Need Engine**: Replaces punitive "risk" scoring with supportive need indicators (`LOW`, `MODERATE`, `HIGH`).
3. **Dedicated Support Navigators**:
   - **Financial Support Navigator**: Uses minimal consented information (no bank statements/credit scores). Phrased as *"You may want to explore this support option"*.
   - **Academic Support Navigator**: Ingests challenge signals and pairs students with peer tutors, advisors, and exam prep clinics.
4. **Transparent Explainability Engine**: Every recommendation provides a clear breakdown of contributing consented signals, timeframes, data NOT used, and non-punitive assurances.
5. **Layered AI Safety Architecture**: Input screening $\rightarrow$ prompt guardrails $ightarrow$ generation $ightarrow$ output validation, with dynamic campus support & crisis helpline escalation.
6. **PS-29 Bias & Fairness Monitoring**: Audits group selection rates & Disparate Impact (80% rule as an audit indicator with small sample size safeguards).
7. **Zero-Punitive Safeguards**: Hardcoded architectural guarantees ensuring Nivara never reduces grades, penalizes attendance, cancels aid, or triggers disciplinary action automatically.
8. **Student Data Transparency & Correction Workflows**: Complete transparency reports and institutional correction request workflows with tamper-evident audit logs.
9. **Dual-Mode MongoDB Support**: Connects to persistent MongoDB or runs seamlessly with in-memory MongoDB fallback for zero-configuration development and automated testing.

---

## 🚀 Quick Start

### 1. Installation
```bash
cd nivara-backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` (default values work out-of-the-box with in-memory MongoDB):
```bash
cp .env.example .env
```

### 3. Seed Demo Data
Populate realistic demo data (Students, Counsellors, Admins, Support Programs, Support Circles, Check-in Histories):
```bash
npm run seed
```

### 4. Start the Server
```bash
npm start
```
The backend starts on `http://localhost:5000`.

### 5. Run Automated Tests
```bash
npm test
```

---

## 🔑 Demo Accounts (After Seeding)

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student** | `rahul.kumar@student.edu` | `StudentPass123!` | 2nd Year CS, moderate academic & financial need |
| **Student** | `priya.sharma@student.edu` | `StudentPass123!` | 3rd Year Mech, stable check-ins |
| **Counsellor** | `counsellor.mentalhealth@campus.edu` | `Counsellor123!` | Senior Mental Health Counsellor |
| **Admin** | `admin.welfare@campus.edu` | `AdminPass123!` | Campus Welfare Administrator |
| **Admin** | `fairness.officer@campus.edu` | `AdminPass123!` | PS-29 Fairness & Bias Auditor |

---

## 📚 API Reference Overview

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full endpoint specifications, request payloads, and example responses.
