import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

interface UploadComponentProps {
  onFileUpload: (formData: FormData) => Promise<void>;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      onFileUpload(formData);
    }
  };

  return (
    <Box>
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" onClick={handleFileUpload}>
        Upload and Analyze
      </Button>
    </Box>
  );
};

export default UploadComponent;
