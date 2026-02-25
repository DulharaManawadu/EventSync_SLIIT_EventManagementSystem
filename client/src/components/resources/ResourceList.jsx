import { deleteResource } from "../../services/resourceService";

const ResourceList = ({ resources, refresh }) => {
  const handleDelete = async (id) => {
    await deleteResource(id);
    refresh();
  };

  return (
    <div>
      <h3 style={{ marginBottom: "15px" }}>Resource List</h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Total</th>
            <th>Available</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((res) => (
            <tr key={res._id}>
              <td>{res.name}</td>
              <td>{res.category}</td>
              <td>{res.totalQuantity}</td>
              <td>{res.availableQuantity}</td>
              <td>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(res._id)}
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

export default ResourceList;