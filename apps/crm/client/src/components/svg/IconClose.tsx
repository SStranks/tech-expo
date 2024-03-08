interface IProps {
  className?: string;
}

function IconClose({ className = undefined }: IProps): JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_429_11083)">
        <path
          className={className}
          d="M7 7.00006L17 17.0001M7 17.0001L17 7.00006"
          stroke="#292929"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_429_11083">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default IconClose;
