import db from "@/lib/db";

export const FREE_TRIAL_LIMIT = 2;

// User ke kitne trial downloads hue hain
export async function getTrialCount(userId) {
  const [[{ count }]] = await db.query(
    "SELECT COUNT(*) AS count FROM download_history WHERE user_id = ? AND was_trial = 1",
    [userId]
  );
  return count;
}

// Trial remaining hai ya nahi
export async function hasTrialRemaining(userId) {
  const used = await getTrialCount(userId);
  return used < FREE_TRIAL_LIMIT;
}

// Trial download record karo
export async function recordTrialDownload(userId, solutionId) {
  await db.query(
    `INSERT IGNORE INTO download_history (user_id, solution_id, was_trial)
     VALUES (?, ?, 1)`,
    [userId, solutionId]
  );
}