import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { RowsTypes } from "../App";

export const EditData = ({
  editData,
  setEditData,
  handleClose,
  getContacts,
}: {
  editData: RowsTypes;
  setEditData: any;
  handleClose: any;
  getContacts: any;
}) => {
  async function editContractBtnHandler(e: any) {
    e.preventDefault();

    const hostName = import.meta.env.VITE_APP_HOSTING_URL;

    if (!hostName) {
      console.error("hostName not found in .env file");
      return;
    }

    if (
      !editData.first_name ||
      !editData.last_name ||
      !editData.email ||
      !editData.phone_number ||
      !editData.company ||
      !editData.job_title
    ) {
      console.error("All fields are required");
      return;
    }

    if (editData.phone_number.length !== 10) {
      console.error("Phone number should be 10 digits long");
      return;
    }

    const res = await axios.put(`${hostName}/api/v1/contacts/${editData.id}`, {
      FirstName: editData.first_name,
      LastName: editData.last_name,
      Email: editData.email,
      PhoneNumber: editData.phone_number,
      Company: editData.company,
      JobTitle: editData.job_title,
      id: editData.id,
    });

    if (res.status === 200) {
      console.log("Contract added successfully");
      handleClose();
      getContacts();
    } else {
      console.error("Something went wrong");
    }
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={style}>
      <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
        Edit New Contract
      </Typography>
      <form
        onSubmit={editContractBtnHandler}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <TextField
          label="First Name"
          variant="outlined"
          name="firstName"
          sx={{ width: "100%" }}
          value={editData.first_name}
          onChange={(e) =>
            setEditData({ ...editData, first_name: e.target.value })
          }
        />
        <TextField
          label="Last Name"
          variant="outlined"
          name="lastName"
          sx={{ width: "100%" }}
          value={editData.last_name}
          onChange={(e) =>
            setEditData({ ...editData, last_name: e.target.value })
          }
        />
        <TextField
          label="Email"
          variant="outlined"
          name="email"
          type="email"
          sx={{ width: "100%" }}
          value={editData.email}
          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
        />
        <TextField
          label="PhoneNumber"
          variant="outlined"
          name="phoneNumber"
          type="number"
          sx={{ width: "100%" }}
          value={editData.phone_number}
          onChange={(e) =>
            setEditData({ ...editData, phone_number: e.target.value })
          }
        />
        <TextField
          label="Company"
          variant="outlined"
          name="company"
          sx={{ width: "100%" }}
          value={editData.company}
          onChange={(e) =>
            setEditData({ ...editData, company: e.target.value })
          }
        />
        <TextField
          label="JobTitle"
          variant="outlined"
          name="jobTitle"
          sx={{ width: "100%" }}
          value={editData.job_title}
          onChange={(e) =>
            setEditData({ ...editData, job_title: e.target.value })
          }
        />

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "70%" }}
            type="submit"
          >
            Edit Contract
          </Button>
        </Box>
      </form>
    </Box>
  );
};
