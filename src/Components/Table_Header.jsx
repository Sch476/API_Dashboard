import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { TextField, IconButton, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";

const myTheme = createTheme({
  components: {
    //@ts-ignore - this isn't in the TS because DataGird is not exported from `@mui/material`
    MuiDataGrid: {
      styleOverrides: {
        row: {
          "&.Mui-selected": {
            backgroundColor: "#C5C5C5",
            color: "black",
          },
        },
      },
    },
  },
});

const useStyles = makeStyles({
  root: {
    border: "1px solid #ccc",
  },
  selectedRow: {
    backgroundColor: "#f0f0f0",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
});

function DataTable() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((res) => {
        setData(res.data.map((item) => ({ ...item, isEditing: false })));
        setFilteredData(
          res.data.map((item) => ({ ...item, isEditing: false }))
        );
        setOriginalData(
          res.data.map((item) => ({ ...item, isEditing: false }))
        );
      })
      .catch((error) => console.error("Error in fetching data", error));
  }, []);

  const columns = [
    {
      field: "name",
      renderHeader: () => <strong style={{ fontSize: 15 }}>{"Name"}</strong>,
      width: 150,
      renderCell: (params) =>
        params.row.isEditing ? (
          <TextField
            value={params.row.name}
            onChange={(e) => handleEditChange(e, params.row.id, "name")}
          />
        ) : (
          params.row.name
        ),
    },
    {
      field: "email",
      renderHeader: () => <strong style={{ fontSize: 15 }}>{"Email"}</strong>,
      width: 250,
      renderCell: (params) =>
        params.row.isEditing ? (
          <TextField
            value={params.row.email}
            onChange={(e) => handleEditChange(e, params.row.id, "email")}
          />
        ) : (
          params.row.email
        ),
    },
    {
      field: "role",
      renderHeader: () => <strong style={{ fontSize: 15 }}>{"Role"}</strong>,
      width: 150,
      renderCell: (params) =>
        params.row.isEditing ? (
          <TextField
            value={params.row.role}
            onChange={(e) => handleEditChange(e, params.row.id, "role")}
          />
        ) : (
          params.row.role
        ),
    },
    {
      field: "actions",
      renderHeader: () => <strong style={{ fontSize: 15 }}>{"Actions"}</strong>,
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
    const updatedData = data.map((d) =>
      d.id === row.id ? { ...d, isEditing: !d.isEditing } : d
    );

    setData(updatedData);
    setFilteredData(updatedData);
  };

  const handleEditChange = (e, id, field) => {
    const updatedData = data.map((d) =>
      d.id === id ? { ...d, [field]: e.target.value } : d
    );

    setData(updatedData);
    setFilteredData(updatedData);
  };

  const handleDelete = (id) => {
    const rowToDelete = data.find((row) => row.id === id);

    if (rowToDelete) {
      const updatedData = data.filter((row) => row.id !== id);
      setData(updatedData);
      setFilteredData(updatedData);
    } else {
      console.warn("Row not found for ID:", id);
    }
  };

  const handleDeleteSelected = () => {
    const updatedData = data.filter((row) => !selectionModel.includes(row.id));

    setData(updatedData);
    setFilteredData(updatedData);
    setSelectionModel([]); // This line clears the selection
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
      <IconButton
        style={{ margin: "24px 0 0 1200px" }}
        aria-label="delete"
        onClick={handleDeleteSelected}
      >
        <DeleteIcon />
      </IconButton>
      <ThemeProvider theme={myTheme}>
        <div style={{ height: 631, width: "100%" }} className={classes.root}>
          <DataGrid
            rows={filteredData}
            columns={columns}
            pageSize={5}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            checkboxSelection
            selectionModel={selectionModel}
            onSelectionModelChange={(newSelection) => {
              setSelectionModel(newSelection.selectionModel);
            }}
            rowClassName={(params) =>
              selectionModel.includes(params.data.id) ? classes.selectedRow : ""
            }
          />
        </div>
      </ThemeProvider>
    </div>
  );
}

export default DataTable;
