import { deleteVenue } from "../../services/venueService";

const VenueList = ({ venues, refresh }) => {
  const handleDelete = async (id) => {
    await deleteVenue(id);
    refresh();
  };

  return (
    <div>
      <h3 style={{ marginBottom: "15px" }}>Venue List</h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {venues.map((venue) => (
            <tr key={venue._id}>
              <td>{venue.name}</td>
              <td>{venue.venueType}</td>
              <td>{venue.capacity}</td>
              <td>{venue.location}</td>
              <td>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(venue._id)}
                >
                  Delete
                </button>
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
  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default VenueList;