import type { IProps } from './';

function IconContacts({ svgClass = undefined }: IProps): React.JSX.Element {
  return (
    <svg className={svgClass} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon Contacts</title>
      <path
        d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M17 11V10C17 8.11438 17 7.17157 16.4142 6.58579C15.8284 6 14.8856 6 13 6H11C9.11438 6 8.17157 6 7.58579 6.58579C7 7.17157 7 8.11438 7 10V11"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M5 11H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default IconContacts;
