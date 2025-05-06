import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AdminFeedback() {
  // Mock feedback data
  const feedbacks = [
    { id: 1, user: "John Doe", rating: 5, comment: "Great product!", date: "2023-05-01", status: "New" },
    { id: 2, user: "Jane Smith", rating: 3, comment: "Average quality", date: "2023-05-02", status: "Processed" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customer Feedback</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell>{feedback.user}</TableCell>
                <TableCell>{feedback.rating}/5</TableCell>
                <TableCell>{feedback.comment}</TableCell>
                <TableCell>{feedback.date}</TableCell>
                <TableCell>{feedback.status}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    {feedback.status === "New" ? "Process" : "View"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}