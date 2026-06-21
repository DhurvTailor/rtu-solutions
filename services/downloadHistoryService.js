import db from "@/lib/db";

export async function logDownload(userId, solutionId, wasTrial = false) {
  const [result] = await db.query(
    "INSERT INTO download_history (user_id, solution_id, was_trial) VALUES (?, ?, ?)",
    [userId, solutionId, wasTrial ? 1 : 0]
  );
  return result;
}

// History page ke liye — title, subject, type sab joined milega
export async function getDownloadHistoryForUser(userId) {
  const [rows] = await db.query(
    `
    SELECT
      download_history.id,
      download_history.downloaded_at,
      download_history.was_trial,
      solutions.id   AS solution_id,
      solutions.title,
      solutions.solution_type,
      solutions.is_premium,
      subjects.name  AS subject_name
    FROM download_history
    JOIN solutions ON download_history.solution_id = solutions.id
    JOIN subjects  ON solutions.subject_id = subjects.id
    WHERE download_history.user_id = ?
    ORDER BY download_history.downloaded_at DESC
    `,
    [userId]
  );
  return rows;
}