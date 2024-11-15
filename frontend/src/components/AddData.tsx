import { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import axios from "axios";

interface AddDataProps {
  getContacts: () => void;
}

export const AddData = ({ getContacts }: AddDataProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function addContractBtnHandler(e: any) {
    e.preventDefault();

    const hostName = import.meta.env.VITE_APP_HOSTING_URL;

    if (!hostName) {
      console.error("hostName not found in .env file");
      return;
    }
    const FirstName = e.target.firstName.value;
    const LastName = e.target.lastName.value;
    const Email = e.target.email.value;
    const PhoneNumber = e.target.phoneNumber.value;
    const Company = e.target.company.value;
    const JobTitle = e.target.jobTitle.value;

    if (
      !FirstName ||
      !LastName ||
      !Email ||
      !PhoneNumber ||
      !Company ||
      !JobTitle
    ) {
      console.error("All fields are required");
      return;
    }

    if(isNaN(PhoneNumber) || PhoneNumber.length !== 10) {
      console.error("Phone number should be 10 digits long");
      return;
    }

    const res = await axios.post(`${hostName}/api/v1/contacts`, {
      FirstName,
      LastName,
      Email,
      PhoneNumber,
      Company,
      JobTitle
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
    <>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginBottom: "1rem",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
          onClick={handleOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={"22px"}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"
            ></path>
          </svg>
          Add New Contract
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Add New Contract
          </Typography>
          <form
            onSubmit={addContractBtnHandler}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <TextField
              label="First Name"
              variant="outlined"
              name="firstName"
              sx={{ width: "100%" }}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              name="lastName"
              sx={{ width: "100%" }}
            />
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              type="email"
              sx={{ width: "100%" }}
            />
            <TextField
              label="PhoneNumber"
              variant="outlined"
              name="phoneNumber"
              type="number"
              sx={{ width: "100%" }}
            />
            <TextField
              label="Company"
              variant="outlined"
              name="company"
              sx={{ width: "100%" }}
            />
            <TextField
              label="JobTitle"
              variant="outlined"
              name="jobTitle"
              sx={{ width: "100%" }}
            />

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "70%" }}
                type="submit"
              >
                Add Contract
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};
