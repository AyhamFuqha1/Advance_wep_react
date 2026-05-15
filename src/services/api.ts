
const API_BASE_URL = "http://127.0.0.1:8000/api";

// ================== Study Plans ==================
export async function getStudyPlans() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/study-plans`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch study plans");
  }

  return response.json();
}

// ================== Analytics ==================
export async function getAnalytics() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/analytics`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}

// ================== AI Generate Study Plan ==================
export async function generateStudyPlan() {
  const token = localStorage.getItem("token");
console.log("study plan token:", token);
  const response = await fetch(`${API_BASE_URL}/generate-study-plan`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to generate AI study plan");
  }

  return response.json();
}
