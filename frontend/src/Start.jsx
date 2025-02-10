import { useRef } from "react";
import { useDispatch } from "react-redux";
import { setupCategories } from "./store/annotation-slice";

const Start = (props) => {
  const input1 = useRef();
  const input2 = useRef();
  const input3 = useRef();
  const input4 = useRef();

  const dispatch = useDispatch();

  const continueHandler = () => {
    const inputValues = [
      input1.current.value,
      input2.current.value,
      input3.current.value,
      input4.current.value,
    ];

    let emptyInputIndices = [];
    for (let i = 0; i < 4; i++) {
      if (inputValues[i] === "") {
        emptyInputIndices.push(i);
      }
    }
    for (let i = emptyInputIndices.length - 1; i >= 0; i--) {
      inputValues.splice(emptyInputIndices[i], 1);
    }

    if (inputValues.length === 0 || !props.videoIsLoaded) {
      console.log("need at least one input value, or video was not selected");
      return;
    }

    dispatch(setupCategories(inputValues));
    props.setIsAtStart(false);
  };

  return (
    <div className="flex justify-center mt-12">
      <div>
        <div className="flex">
          <input
            type="file"
            onChange={props.handleFileUpload}
            className="border-[1px] block"
          />
          {props.videoIsLoaded && <div>V</div>}
        </div>

        <h3 className="mt-4">Mouse ID's:</h3>
        <div className="mt-2">
          <div className="">
            <label htmlFor="1">1. </label>
            <input id="1" type="text" className="border-[1px]" ref={input1} />
          </div>
          <div className="mt-1">
            <label htmlFor="2">2. </label>
            <input id="2" type="text" className="border-[1px]" ref={input2} />
          </div>
          <div className="mt-1">
            <label htmlFor="3">3. </label>
            <input id="3" type="text" className="border-[1px]" ref={input3} />
          </div>
          <div className="mt-1">
            <label htmlFor="4">4. </label>
            <input id="4" type="text" className="border-[1px]" ref={input4} />
          </div>
        </div>
        <button
          onClick={continueHandler}
          className="border-[1px] px-2 py-1 mt-1"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Start;
