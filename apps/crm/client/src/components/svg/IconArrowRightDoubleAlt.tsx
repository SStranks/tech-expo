import type { Props } from './';

function IconArrowRightDoubleAlt({ svgClass = undefined }: Props): React.JSX.Element {
  return (
    <svg className={svgClass} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon Arrow Double Right</title>
      <path
        d="M11 19L17 12L11 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.99982 19L12.9998 12L6.99982 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default IconArrowRightDoubleAlt;
