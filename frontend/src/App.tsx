import { Box, Typography } from "@mui/material";
import DataTable from "./components/DataTable";
import { AddData } from "./components/AddData";
import { useEffect, useState } from "react";
import axios from "axios";

export interface RowsTypes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  company: string;
  job_title: string;
} 

function App() {

  const [rows, setRows] = useState<RowsTypes[]>([]);

  async function getContacts() {
    try {
      const hostName = import.meta.env.VITE_APP_HOSTING_URL;
      if (!hostName) {
        console.error("hostName not found in .env file");
        return;
      }

      const res = await axios.get(`${hostName}/api/v1/contacts`);
      setRows(res.data);
    } catch (err) {
      console.error("Error getting contacts", err);
    }
  }

  useEffect(() => {
    getContacts();
  }, []);

  
  return (
    <>
      <Box sx={{ marginY: "4rem", marginX: "4rem" }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", marginBottom: "2rem", textAlign: "center" }}
        >
          CoreContract
        </Typography>

        <AddData getContacts={getContacts} />

        <DataTable rows={rows} getContacts={getContacts} />
      </Box>
    </>
  );
}

export default App;
