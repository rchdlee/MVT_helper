const SelectFolder = (props) => {
  const handleFolderUpload = (e) => {
    const files = Array.from(e.target.files);
    const mp4File = files.find((f) => f.name.toLowerCase().endsWith(".mp4"));

    console.log(files, mp4File);
    if (mp4File) {
      props.handleFileUpload(e, true, mp4File);
    } else {
      console.alert("No mp4 file found in folder.");
      return;
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <p className="w-24">Select Folder:</p>
        <input
          type="file"
          webkitdirectory="true"
          onChange={handleFolderUpload}
          //   onChange={props.handleFileUpload}
          className="border-[1px] block w-164"
        />
        {props.videoIsLoaded && <div>✔</div>}
      </div>

      <div className="flex gap-2 mt-2">
        <h3 className="w-24">Mouse ID's:</h3>
        <div className="flex gap-2 flex-grow">
          <div className="w-1/2">
            <div className="flex flex-col">
              <label htmlFor="1" className="text-sm">
                Mouse 1
              </label>
              <input
                id="1"
                type="text"
                className="border-[1px]"
                ref={props.input1}
              />
            </div>
            <div className="mt-1 flex flex-col">
              <label htmlFor="2" className="text-sm">
                Mouse 2
              </label>
              <input
                id="2"
                type="text"
                className="border-[1px]"
                ref={props.input2}
              />
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex flex-col">
              <label htmlFor="3" className="text-sm">
                Mouse 3
              </label>
              <input
                id="3"
                type="text"
                className="border-[1px]"
                ref={props.input3}
              />
            </div>
            <div className="mt-1 flex flex-col">
              <label htmlFor="4" className="text-sm">
                Mouse 4
              </label>
              <input
                id="4"
                type="text"
                className="border-[1px]"
                ref={props.input4}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={props.continueHandler}
          className="border-[1px] px-2 py-1 mt-1"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectFolder;
