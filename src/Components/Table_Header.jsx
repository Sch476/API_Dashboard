import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { TextField, IconButton, Modal, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const useStyles = makeStyles({
  root: {
    border: "1px solid #ccc",
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  },
});

function DataTable() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);
        setOriginalData(res.data);
      })
      .catch((error) => console.error("Error in fetching data", error));
  }, []);

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <>
          <IconButton aria-label="edit" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredRows = originalData.filter(
      (row) =>
        row.name.toLowerCase().includes(value) ||
        row.email.toLowerCase().includes(value) ||
        row.role.toLowerCase().includes(value)
    );
    setFilteredData(filteredRows);
  };

  const handleEdit = (row) => {
    console.log("Edit clicked for:", row);
    setSelectedRow(row);
    setEditModalOpen(true);
  };

  const handleDelete = (id) => {
    console.log("Delete clicked for ID:", id);

    // Check if the row with the specified ID exists in the selected data
    const rowToDelete = data.find((row) => row.id === id);

    if (rowToDelete) {
      // Filter out the deleted row
      const updatedData = data.filter((row) => row.id !== id);
      setData(updatedData);
      setFilteredData(updatedData);
    } else {
      console.warn("Row not found for ID:", id);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleSaveEdit = () => {
    // Implement logic to save edited data
    // For simplicity, just log the updated data
    console.log("Saving edited data:", selectedRow);
    setEditModalOpen(false);
  };

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        style={{ margin: "16px 0 16px 15px" }}
      />
      <div style={{ height: 600, width: "100%" }} className={classes.root}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={5}
          checkboxSelection
        />
      </div>

      <Modal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes.modal}>
          {/* Implement your edit form or modal content here */}
          <h2>Edit Row</h2>
          <p>Edit your row data here.</p>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
          </Button>
          <Button
            onClick={handleCloseEditModal}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default DataTable;
