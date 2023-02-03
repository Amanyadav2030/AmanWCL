import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  console.log();
  const uploadFileDrivePicker = () => {
    try {
      OneDrive.open({
        clientId: `${import.meta.env.VITE_CLIENT_ID}`,
        action: "download",
        multiSelect: false,
        success: function (files) {
          setFile(files[0]);
        },
        cancel: function () {
          console.log("File picker was cancelled");
        },
        error: function (error) {
          console.log("File picker error: " + error.message);
        }
      });

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {file ? (
        <div>
          File selected: {file.name}
        </div>
      ) : (
        <button onClick={uploadFileDrivePicker}>
          Select file from OneDrive
        </button>
      )}
    </div>
  );
};
export default App;
