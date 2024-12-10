import type { IProps } from './';

function IconOperatorPlus({ svgClass = undefined }: IProps): React.JSX.Element {
  return (
    <svg
      className={svgClass}
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <title>Icon Operator Plus</title>
      <path d="M6 12H18M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default IconOperatorPlus;
