import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { useDispatch, useSelector } from "react-redux";
import { fetchSupportTickets, respondToTicket } from "@/store/assistance/support-slice";

export default function SupportTickets() {
  const dispatch = useDispatch();
  const { tickets, loading } = useSelector(state => state.assistanceSupport);

  useEffect(() => {
    dispatch(fetchSupportTickets());
  }, [dispatch]);

  const columns = [
    {
      header: "Ticket ID",
      accessor: "_id",
      cell: ({ row }) => row._id.slice(-6)
    },
    {
      header: "Customer",
      accessor: "user.userName"
    },
    {
      header: "Type",
      accessor: "type",
      cell: ({ row }) => (
        <span className="capitalize">{row.type}</span>
      )
    },
    {
      header: "Status",
      accessor: "status",
      cell: ({ row }) => <StatusBadge status={row.status} />
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => dispatch(respondToTicket({
            ticketId: row._id,
            response: "We're looking into this"
          }))}
          disabled={row.status === 'resolved'}
        >
          Respond
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Support Tickets</h1>
      <Card>
        <DataTable 
          columns={columns} 
          data={tickets} 
          loading={loading}
        />
      </Card>
    </div>
  );
}