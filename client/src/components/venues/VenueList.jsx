import { deleteVenue } from "../../services/venueService";

const VenueList = ({ venues, refresh, onEdit }) => {
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this venue?");
    if (!confirmDelete) return;

    await deleteVenue(id);
    refresh();
  };

  return (
    <div>
      <h3 style={styles.title}>Venue List</h3>

      {venues.length === 0 ? (
        <p style={styles.empty}>No venues available</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Capacity</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {venues.map((venue) => (
              <tr
                key={venue._id}
                style={styles.row}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td style={styles.td}>{venue.name}</td>
                <td style={styles.td}>{venue.venueType}</td>
                <td style={styles.td}>{venue.capacity}</td>
                <td style={styles.td}>{venue.location}</td>

                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.status,
                      background:
                        venue.availabilityStatus === "Available"
                          ? "#dcfce7"
                          : "#fee2e2",
                      color:
                        venue.availabilityStatus === "Available"
                          ? "#166534"
                          : "#991b1b"
                    }}
                  >
                    {venue.availabilityStatus}
                  </span>
                </td>

                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      style={styles.editBtn}
                      onClick={() => onEdit(venue)}
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(venue._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  title: {
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "600"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #e5e7eb",
    fontSize: "14px",
    color: "#475569"
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px"
  },

  row: {
    transition: "background 0.2s"
  },

  actions: {
    display: "flex",
    gap: "8px"
  },

  editBtn: {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  status: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500"
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#64748b"
  }
};

export default VenueList;