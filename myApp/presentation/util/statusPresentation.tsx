const statuses = ["pending", "placed", "completed"];

export default function statusPresentation(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "⏳ ממתין",
    placed: "📥 שודר",
    completed: "✔️ סופק",
  };

  return statusMap[status] || status; // Return the Hebrew translation or the original status if not found
}
