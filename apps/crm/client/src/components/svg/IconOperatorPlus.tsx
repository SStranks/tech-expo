interface IProps {
  className?: string;
}

function IconOperatorPlus({ className = undefined }: IProps): JSX.Element {
  return (
    <svg
      className={className}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M6 12H18M12 6V18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default IconOperatorPlus;
