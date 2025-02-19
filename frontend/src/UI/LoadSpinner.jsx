const LoadSpinner = () => {
  return (
    <div
      className="inline-block w-6 h-6 after:content-[' '] after:block after:w-6 after:h-6 after:m-1 after:border-[3px] 
after:border-t-blackTextLight after:border-l-transparent after:border-b-blackTextLight after:border-r-transparent
dark:after:border-t-white dark:after:border-l-transparent dark:after:border-b-white dark:after:border-r-transparent
after:animate-spin
after:rounded-full"
    ></div>
  );
};

export default LoadSpinner;
