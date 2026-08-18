# Nivara Backend — Complete API Reference (v2.1)

Base URL: `http://localhost:5000/api`

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Register a new student, counsellor, or admin.
```json
{
  "email": "student@campus.edu",
  "password": "Password123!",
  "role": "STUDENT",
  "name": "Alex Smith",
  "course": "B.Tech Computer Science",
  "year": 2,
  "department": "Engineering"
}
```

### `POST /api/auth/login`
```json
{
  "email": "student@campus.edu",
  "password": "Password123!"
}
```

---

## 2. Consent Management (`/api/consent`)

### `GET /api/consent`
Retrieve all active consent records for the logged-in student.

### `POST /api/consent`
Grant or update consent.
```json
{
  "consentType": "financial_matching",
  "granted": true
}
```

### `PUT /api/consent/:consentType/revoke`
Revoke a specific consent type immediately.

---

## 3. Student Dashboard & Transparency (`/api/student`)

### `GET /api/student/today`
Returns today's summary: check-in completion status, upcoming appointments, active support recommendation count, unread notifications, and recommended actions.

### `GET /api/student/transparency`
Returns comprehensive report of "What Nivara Knows, Uses & Who Can Access", detailing optional vs core data and non-punitive guarantees.

### `GET /api/student/insights`
Returns 7-day and 30-day aggregated well-being trends and average metrics.

---

## 4. Daily Check-In (`/api/checkins`)

### `POST /api/checkins`
Submit daily 1-5 well-being ratings.
```json
{
  "mood": 3,
  "stress": 4,
  "sleep": 2,
  "energy": 3,
  "academicPressure": 4,
  "notes": "Feeling slightly overwhelmed by upcoming midterm."
}
```

---

## 5. Academic Support Navigator (`/api/academic`)

### `GET /api/academic/signals`
Fetch current self-reported academic signals.

### `POST /api/academic/signals`
Update academic signals (requires `academic_integration` consent).
```json
{
  "academicStress": 4,
  "subjectDifficulty": ["Data Structures", "Engineering Mathematics"],
  "examPressure": 4,
  "placementAnxiety": false,
  "assignmentChallenges": true,
  "attendanceTrend": "DECLINING"
}
```

### `GET /api/academic/recommendations`
Returns matched peer tutoring, faculty advising, and study clinic opportunities.

---

## 6. Financial Support Navigator (`/api/financial-support`)

### `POST /api/financial-support/profile`
Submit minimal consented financial input (requires `financial_matching` consent).
```json
{
  "feeDifficulty": "MODERATE",
  "expenseCategories": ["TUITION", "BOOKS"],
  "currentAidStatus": "NOT_RECEIVING",
  "supportPreferences": ["SCHOLARSHIPS", "INSTALLMENT_PLAN"]
}
```

### `GET /api/financial-support/recommendations`
Returns relevant financial aid, scholarships, and fee installment schemes with non-definitive phrasing.

---

## 7. Explainable Recommendations (`/api/recommendations`)

### `GET /api/recommendations`
List active recommendations across Academic, Financial, and Well-being categories.

### `GET /api/recommendations/:id/explanation`
"Why am I seeing this?" transparent breakdown.
```json
{
  "recommendationId": "66c0...",
  "programTitle": "Tuition Fee Installment Assistance Plan",
  "category": "FINANCIAL",
  "explanation": {
    "summary": "You may want to explore this support option...",
    "contributingFactors": [
      "Consented response: Indicated 'moderate' difficulty with educational expenses.",
      "Target expense categories identified: TUITION, BOOKS.",
      "Current aid status reported: not receiving."
    ],
    "timeWindow": "Evaluated from check-in ratings and profile inputs submitted in the past 14 days.",
    "dataNotUsed": [
      "Bank account statements, credit scores, or Aadhaar numbers",
      "Academic grade disciplinary files",
      "Unconsented institutional records"
    ],
    "nonPunitiveAssurance": "This recommendation is solely for support navigation. It does not affect your grades, scholarship standing, attendance penalties, or disciplinary record."
  }
}
```

---

## 8. Layered AI Support Space (`/api/ai`)

### `POST /api/ai/chat`
Empathetic conversation with multi-stage safety screening and dynamic campus resource routing.
```json
{
  "message": "I'm feeling very overwhelmed with my exams and assignments."
}
```

---

## 9. Counsellors & Appointments (`/api/counsellors` & `/api/appointments`)

- `GET /api/counsellors`: Search campus counsellors by specialization.
- `POST /api/appointments`: Book a session (`REQUESTED` lifecycle state).
- `PUT /api/appointments/:id/status`: Counsellor updates appointment state.
- `POST /api/counsellor/session-notes`: Private session note (strictly isolated to the assigned counsellor).

---

## 10. Temporary Support Circles (`/api/support-circles`)

- `GET /api/support-circles`: List active temporary peer circles.
- `POST /api/support-circles/:id/join`: Join peer circle.
- `POST /api/support-circles/:id/posts`: Submit message (screened by AI moderation).

---

## 11. Student Profile Correction (`/api/profile`)

- `POST /api/profile/correction-request`: Submit institutional correction request.
- `PUT /api/profile/admin/correction-requests/:id`: Admin approves/rejects with audit trail.

---

## 12. Admin & Fairness Dashboard (`/api/admin`)

- `GET /api/admin/dashboard`: Aggregated campus support demand metrics.
- `GET /api/admin/fairness/audit`: Disparate impact & selection rate monitoring.
- `POST /api/admin/fairness/evaluate`: Trigger ad-hoc fairness evaluation.
- `GET /api/admin/audit-logs`: Immutable system audit logs.
