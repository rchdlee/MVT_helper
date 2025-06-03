const StartTabs = (props) => {
  return (
    <div className="flex gap-4 justify-start mb-2 mt-2">
      <div onClick={() => props.switchTabsHandler("new_mvt")}>
        <p
          className={`${
            props.openTab === "new_mvt" ? "underline" : ""
          } hover:underline cursor-pointer`}
        >
          New MVT
        </p>
      </div>
      <div onClick={() => props.switchTabsHandler("load_mvt")}>
        <p
          className={`${
            props.openTab === "load_mvt" ? "underline" : ""
          } hover:underline cursor-pointer`}
        >
          Load MVT
        </p>
      </div>
      <div onClick={() => props.switchTabsHandler("screenshot")}>
        <p
          className={`${
            props.openTab === "screenshot" ? "underline" : ""
          } hover:underline cursor-pointer`}
        >
          Screenshots from CSV
        </p>
      </div>
    </div>
  );
};

export default StartTabs;
