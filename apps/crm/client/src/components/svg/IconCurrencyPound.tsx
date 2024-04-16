import type { IProps } from './';

function IconCurrencyPound({ className = undefined }: IProps): JSX.Element {
  return (
    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        className={className}
        d="M5 20H19M5 13H15M18 6.81794C17.1896 5.14985 15.4791 4 13.5 4C10.7386 4 8.5 6.23858 8.5 9V17C8.5 18.6569 7.15685 20 5.5 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default IconCurrencyPound;
