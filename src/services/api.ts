const API_BASE_URL = "http://127.0.0.1:8000/api";

// ================== Study Plans ==================
export async function getStudyPlans(userId: number = 1) {
  const response = await fetch(`${API_BASE_URL}/study-plans?user_id=${userId}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch study plans");
  }

  return response.json();
}

// ================== Analytics ==================
export async function getAnalytics() {
  const response = await fetch(`${API_BASE_URL}/analytics`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}

// ================== AI Generate Study Plan ==================
export async function generateStudyPlan(userId: number) {
  const response = await fetch(`${API_BASE_URL}/generate-study-plan/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to generate AI study plan");
  }

  return response.json();
}