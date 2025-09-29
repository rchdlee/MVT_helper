import { useDispatch } from "react-redux";
import { setMetadataValue } from "./store/annotation-slice";

const Metadata = (props) => {
  const metadataRedux = props.reduxState.metadata;
  const dispatch = useDispatch();

  const setMetadataHandler = (e) => {
    const category = e.target.id;
    const value = e.target.value;

    console.log(category, value);
    dispatch(
      setMetadataValue({
        category,
        value,
      })
    );
  };

  return (
    <div className="absolute right-0 w-64 h-96 border-[1px] z-60 bg-blue-100 px-4 py-2">
      <div className="w-full flex justify-end">
        <button
          className="w-6 h-6 border-[1px] flex justify-center items-center hover:bg-red-400"
          onClick={() => props.setMetadataMenuIsOpen((prevState) => !prevState)}
        >
          X
        </button>
      </div>
      <div className="w-full">
        <label htmlFor="first_mouse_enter_time" className="text-xs">
          First Mouse Enter Time
        </label>
        <input
          type="text"
          id="first_mouse_enter_time"
          className="bg-white w-full px-1 py-1 text-sm"
          placeholder="hh:mm:ss"
          defaultValue={metadataRedux.first_mouse_enter_time}
          onBlur={setMetadataHandler}
        />
      </div>
      <div className="w-full">
        <label htmlFor="group" className="text-xs">
          Group
        </label>
        <input
          type="text"
          id="group"
          className="bg-white w-full px-1 py-1 text-sm"
          placeholder="e.g., TeenF"
          defaultValue={metadataRedux.group}
          onBlur={setMetadataHandler}
        />
      </div>
      <div className="w-full">
        <label htmlFor="cohort" className="text-xs">
          Cohort
        </label>
        <input
          type="text"
          id="cohort"
          className="bg-white w-full px-1 py-1 text-sm"
          placeholder="e.g., TeenF2"
          defaultValue={metadataRedux.cohort}
          onBlur={setMetadataHandler}
        />
      </div>
      <div className="w-full">
        <label htmlFor="date" className="text-xs">
          Date
        </label>
        <input
          type="text"
          id="date"
          className="bg-white w-full px-1 py-1 text-sm"
          placeholder="yyyymmdd"
          defaultValue={metadataRedux.date}
          onBlur={setMetadataHandler}
        />
      </div>
      <div className="w-full">
        <label htmlFor="run" className="text-xs">
          Run
        </label>
        <input
          type="text"
          id="run"
          className="bg-white w-full px-1 py-1 text-sm"
          placeholder="run"
          defaultValue={metadataRedux.run}
          onBlur={setMetadataHandler}
        />
      </div>
    </div>
  );
};

export default Metadata;
