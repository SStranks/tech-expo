import type { IProps } from './';

function IconClose({ svgClass = undefined }: IProps): React.JSX.Element {
  return (
    <svg className={svgClass} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon Close</title>
      <g clipPath="url(#clip0_429_11083)">
        <path
          d="M7 7.00006L17 17.0001M7 17.0001L17 7.00006"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_429_11083">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default IconClose;
