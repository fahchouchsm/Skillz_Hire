import React from "react";

interface StepperProps {
  step: number;
}

const Stepper: React.FC<StepperProps> = ({ step }) => {
  const getStepClass = (currentStep: number) => {
    return currentStep <= step
      ? "text-emerald-600 dark:text-emerald-500"
      : "text-gray-500 dark:text-gray-100";
  };
  const getStepBgClass = (currentStep: number) => {
    return currentStep <= step
      ? "bg-emerald-100 dark:bg-emerald-800"
      : "bg-gray-100 dark:bg-gray-700";
  };
  const getAfterClass = (currentStep: number) => {
    return currentStep < step
      ? "after:border-emerald-100 dark:after:border-emerald-800"
      : "after:border-gray-100 dark:after:border-gray-700";
  };
  const doneSvg = (
    <svg
      className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${getStepClass(1)}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 12"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M1 5.917L5.724 10.5 15 1.5"
      />
    </svg>
  );
  const svg1 = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${getStepClass(1)}`}
    >
      <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zm96 320h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM144 64h96c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
    </svg>
  );
  const svg2 = (
    <svg
      className={`w-4 h-4 lg:w-5 lg:h-5 ${getStepClass(2)}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 16"
    >
      <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
    </svg>
  );
  const svg3 = (
    <svg
      className={`w-4 h-4 lg:w-5 lg:h-5 ${getStepClass(3)}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 18 20"
    >
      <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
    </svg>
  );

  return (
    <ol className="flex items-center w-full">
      <li
        className={`flex w-full items-center ${getStepClass(1)} ${getAfterClass(
          1
        )} after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block`}
      >
        <span
          className={`flex  items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${getStepBgClass(
            1
          )}`}
        >
          {step > 1 ? doneSvg : svg1}
        </span>
      </li>
      <li
        className={`flex w-full items-center ${getStepClass(2)} ${getAfterClass(
          2
        )} after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block`}
      >
        <span
          className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${getStepBgClass(
            2
          )}`}
        >
          {step > 2 ? doneSvg : svg2}
        </span>
      </li>
      <li className={`flex items-center flex-grow ${getStepClass(3)}`}>
        <span
          className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${getStepBgClass(
            3
          )}`}
        >
          {step >= 3 ? doneSvg : svg3}
        </span>
      </li>
    </ol>
  );
};

export default Stepper;
