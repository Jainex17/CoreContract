import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { RowsTypes } from "../App";
import { IconButton, Modal } from "@mui/material";
import axios from "axios";
import { EditData } from "./EditData";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof RowsTypes;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "first_name",
    numeric: false,
    disablePadding: true,
    label: "First Name",
  },
  {
    id: "last_name",
    numeric: true,
    disablePadding: false,
    label: "Last Name",
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "phone_number",
    numeric: true,
    disablePadding: false,
    label: "Phone Number",
  },
  {
    id: "company",
    numeric: true,
    disablePadding: false,
    label: "Company",
  },
  {
    id: "job_title",
    numeric: true,
    disablePadding: false,
    label: "Job Title",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof RowsTypes
  ) => void;
  order: Order;
  orderBy: keyof RowsTypes;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof RowsTypes) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="left">Action</TableCell>
      </TableRow>
    </TableHead>
  );
}

export default function DataTable({ rows, getContacts }: { rows: RowsTypes[], getContacts: () => void }) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof RowsTypes>("first_name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [visibleRows, setVisibleRows] = React.useState<RowsTypes[]>([]);
  
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpen = () => setOpenEdit(true);
  const handleClose = () => setOpenEdit(false);


  React.useEffect(() => {
    setVisibleRows(
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  }, [rows, order, orderBy, page, rowsPerPage]);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof RowsTypes
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const [editData, setEditData] = React.useState<RowsTypes>({
    id: -1,
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company: "",
    job_title: "",
  });
  const handleEdit = (id: number, first_name: string, last_name: string, email: string, phone_number: string, company: string, job_title: string) => {
    setEditData({id, first_name, last_name, email, phone_number, company, job_title});
    handleOpen();
  }

  const handleDelete = async (id: number) => {
    if(!id) return;

    if(!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      const hostName = import.meta.env.VITE_APP_HOSTING_URL;

      if (!hostName) {
        console.error("hostName not found in .env file");
        return;
      }

      const res = await axios.delete(`${hostName}/api/v1/contacts/${id}`);

      if(res.status === 200) {
        getContacts();
      }else{
        console.error("Error deleting record: ", res);
      }

    } catch (error) {
      console.error("Error deleting record: ", error);
    }
  }
  

  return (
    <>
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                return (
                  <TableRow
                    hover
                    tabIndex={0}
                    key={index}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{row.first_name}</TableCell>
                    <TableCell align="left">{row.last_name}</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{row.phone_number}</TableCell>
                    <TableCell align="left">{row.company}</TableCell>
                    <TableCell align="left">{row.job_title}</TableCell>
                    <TableCell align="left">
                      <IconButton onClick={() => handleEdit(row.id, row.first_name, row.last_name, row.email, row.phone_number, row.company, row.job_title)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={22}
                          height={22}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
                          ></path>
                        </svg>
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row.id)}>
                        <svg
                          width={22}
                          height={22}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"
                          ></path>
                        </svg>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
        
    <Modal
        open={openEdit}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <EditData
          editData={editData}
          setEditData={setEditData}
          handleClose={handleClose}
          getContacts={getContacts}
        />
      </Modal>
    </Box>
    </>
  );
}
