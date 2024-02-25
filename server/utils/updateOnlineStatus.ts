export async function updateOnlineStatus(userId: string, isOnline: boolean) {
  await fetch("http://localhost:3000/api/updateOnlineStatus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, isOnline }),
  });
}
