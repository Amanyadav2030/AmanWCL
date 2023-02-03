import React, { useContext } from "react";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
const Uploader = () => {
  console.log();
  const [file, setFile] = useState(null);
  const [token, setToken] = useState("");
  const [isUploadEnable, setIsUploadEnable] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    if (!window.location.href) return;
    let finalStr;
    const urlStr = window.location.href.split("=")[1];
    if (urlStr && urlStr.includes("&")) {
      finalStr = urlStr.split("&")[0];
    }
    if (finalStr) {
      setToken(finalStr);
    }
  }, []);

  useEffect(() => {
    if (!!token) {
      setIsUploadEnable(true);
    }
  }, [token]);

  const handleInitialize = async () => {
    try {
      const URI = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&response_type=token&scope=files.readwrite`;
      window.location.href = URI;
      return;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const handleUpload = async () => {
    try {
      console.log(token);
      const accessToken = token;
      console.log(
        "🚀 ~ file: Uploader.jsx:48 ~ handleUpload ~ accessToken",
        accessToken
      );

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/octet-stream",
        },
        onUploadProgress: (progressEvent) => {
          setProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
        },
      };

      const name = file.name;

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.put(
        `https://graph.microsoft.com/v1.0/me/drive/root:/${name}:/content`,
        formData,
        config
      );
      console.log(response);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  console.log(error);

  return (
    <div className="uploader">
      <h3>File Upload</h3>
      <input type="file" onChange={handleFileSelect} />
      <div className="button-group">
        <button disabled={isUploadEnable} onClick={handleInitialize}>
          Initialize
        </button>
        <button disabled={!isUploadEnable} onClick={handleUpload}>
          Upload
        </button>
      </div>
      <div>Progress: {progress}%</div>
    </div>
  );
};

export default Uploader;
