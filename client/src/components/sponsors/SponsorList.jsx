import { approveSponsor, rejectSponsor } from "../../services/sponsorService";

const SponsorList = ({ sponsors, refresh }) => {

  const handleApprove = async (id) => {
    await approveSponsor(id);
    refresh();
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    await rejectSponsor(id, reason);
    refresh();
  };

  return (
    <div>
      <h3 style={{ marginBottom: "15px" }}>Sponsor Applications</h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Company</th>
            <th>Tier</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sponsors.map((sp) => (
            <tr key={sp._id}>
              <td>{sp.companyName}</td>
              <td>{sp.tier}</td>
              <td>${sp.contributionAmount}</td>
              <td>
                <span style={getStatusStyle(sp.status)}>
                  {sp.status}
                </span>
              </td>
              <td>
                {sp.status === "Pending" && (
                  <>
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleApprove(sp._id)}
                    >
                      Approve
                    </button>

                    <button
                      style={styles.rejectBtn}
                      onClick={() => handleReject(sp._id)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  approveBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    marginRight: "5px",
    cursor: "pointer"
  },
  rejectBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

const getStatusStyle = (status) => {
  if (status === "Approved") {
    return { color: "#16a34a", fontWeight: "bold" };
  }
  if (status === "Rejected") {
    return { color: "#dc2626", fontWeight: "bold" };
  }
  return { color: "#f59e0b", fontWeight: "bold" };
};

export default SponsorList;