import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchSupportTickets, respondToTicket } from "@/store/assistance/support-slice";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function AssistanceTickets() {
  const dispatch = useDispatch();
  const { tickets, loading } = useSelector(state => state.assistanceSupport);
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    dispatch(fetchSupportTickets());
  }, [dispatch]);

  const handleStartResponse = (ticketId) => {
    setRespondingTo(ticketId);
    setResponseText("");
  };

  const handleSubmitResponse = () => {
    if (responseText.trim()) {
      dispatch(respondToTicket({ 
        ticketId: respondingTo, 
        response: responseText 
      }));
      setRespondingTo(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Support Tickets</h1>
      
      {loading ? (
        <div>Loading tickets...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets?.map(ticket => (
                <TableRow key={ticket._id}>
                  <TableCell className="font-medium">{ticket.user?.userName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{ticket.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      ticket.status === 'resolved' ? 'success' : 
                      ticket.status === 'pending' ? 'warning' : 'secondary'
                    }>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {respondingTo === ticket._id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Enter your response..."
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSubmitResponse}>
                            Submit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setRespondingTo(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={ticket.status === 'resolved'}
                        onClick={() => handleStartResponse(ticket._id)}
                      >
                        Respond
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}