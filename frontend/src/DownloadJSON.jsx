import { useSelector } from "react-redux";

const DownloadJSON = () => {
  const metadataRedux = useSelector((state) => state.annotation.metadata);

  const downloadJSON = () => {
    const metadataJSON = JSON.stringify(metadataRedux);
    console.log("downloading", metadataJSON);
    const blob = new Blob([metadataJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "metadata.json"; // filename
    link.click();

    URL.revokeObjectURL(url); // cleanup
  };

  return (
    <div className="group">
      <button className="flex" onClick={downloadJSON}>
        <p className="group-hover:underline">Download Metadata JSON</p>
        <p>⬇</p>
      </button>
    </div>
  );
};

export default DownloadJSON;
