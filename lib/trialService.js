import db from "@/lib/db";

export const FREE_TRIAL_LIMIT = 2;

export async function getTrialCount(userId) {
  const [[{ count }]] = await db.query(
    "SELECT COUNT(*) AS count FROM download_history WHERE user_id = ? AND was_trial = 1",
    [userId]
  );
  return Number(count);
}

export async function hasTrialRemaining(userId) {
  const used = await getTrialCount(userId);
  return used < FREE_TRIAL_LIMIT;
}

export async function recordTrialDownload(userId, solutionId) {
  await db.query(
    `INSERT IGNORE INTO download_history (user_id, solution_id, was_trial) VALUES (?, ?, 1)`,
    [userId, solutionId]
  );
}