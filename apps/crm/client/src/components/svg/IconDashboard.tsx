import type { IProps } from './';

function IconDashboard({ className = undefined }: IProps): JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        className={className}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.2626 3.26045C7.38219 2.13044 8.33828 1.25 9.5 1.25H14.5C15.6617 1.25 16.6178 2.13044 16.7374 3.26045C17.5005 3.27599 18.1603 3.31546 18.7236 3.41895C19.4816 3.55818 20.1267 3.82342 20.6517 4.34835C21.2536 4.95027 21.5125 5.70814 21.6335 6.60825C21.75 7.47522 21.75 8.57754 21.75 9.94513V16.0549C21.75 17.4225 21.75 18.5248 21.6335 19.3918C21.5125 20.2919 21.2536 21.0497 20.6517 21.6517C20.0497 22.2536 19.2919 22.5125 18.3918 22.6335C17.5248 22.75 16.4225 22.75 15.0549 22.75H8.94513C7.57754 22.75 6.47522 22.75 5.60825 22.6335C4.70814 22.5125 3.95027 22.2536 3.34835 21.6517C2.74643 21.0497 2.48754 20.2919 2.36652 19.3918C2.24996 18.5248 2.24998 17.4225 2.25 16.0549V9.94513C2.24998 8.57754 2.24996 7.47522 2.36652 6.60825C2.48754 5.70814 2.74643 4.95027 3.34835 4.34835C3.87328 3.82342 4.51836 3.55818 5.27635 3.41895C5.83973 3.31546 6.49952 3.27599 7.2626 3.26045ZM7.26496 4.76087C6.54678 4.7762 5.99336 4.81234 5.54735 4.89426C4.98054 4.99838 4.65246 5.16556 4.40901 5.40901C4.13225 5.68577 3.9518 6.07435 3.85315 6.80812C3.75159 7.56347 3.75 8.56458 3.75 10V16C3.75 17.4354 3.75159 18.4365 3.85315 19.1919C3.9518 19.9257 4.13225 20.3142 4.40901 20.591C4.68577 20.8678 5.07435 21.0482 5.80812 21.1469C6.56347 21.2484 7.56458 21.25 9 21.25H15C16.4354 21.25 17.4365 21.2484 18.1919 21.1469C18.9257 21.0482 19.3142 20.8678 19.591 20.591C19.8678 20.3142 20.0482 19.9257 20.1469 19.1919C20.2484 18.4365 20.25 17.4354 20.25 16V10C20.25 8.56458 20.2484 7.56347 20.1469 6.80812C20.0482 6.07434 19.8678 5.68577 19.591 5.40901C19.3475 5.16556 19.0195 4.99838 18.4527 4.89426C18.0066 4.81234 17.4532 4.7762 16.735 4.76087C16.6058 5.88062 15.6544 6.75 14.5 6.75H9.5C8.34559 6.75 7.39424 5.88062 7.26496 4.76087ZM9.5 2.75C9.08579 2.75 8.75 3.08579 8.75 3.5V4.5C8.75 4.91421 9.08579 5.25 9.5 5.25H14.5C14.9142 5.25 15.25 4.91421 15.25 4.5V3.5C15.25 3.08579 14.9142 2.75 14.5 2.75H9.5ZM6.25 10.5C6.25 10.0858 6.58579 9.75 7 9.75H7.5C7.91421 9.75 8.25 10.0858 8.25 10.5C8.25 10.9142 7.91421 11.25 7.5 11.25H7C6.58579 11.25 6.25 10.9142 6.25 10.5ZM9.75 10.5C9.75 10.0858 10.0858 9.75 10.5 9.75H17C17.4142 9.75 17.75 10.0858 17.75 10.5C17.75 10.9142 17.4142 11.25 17 11.25H10.5C10.0858 11.25 9.75 10.9142 9.75 10.5ZM6.25 14C6.25 13.5858 6.58579 13.25 7 13.25H7.5C7.91421 13.25 8.25 13.5858 8.25 14C8.25 14.4142 7.91421 14.75 7.5 14.75H7C6.58579 14.75 6.25 14.4142 6.25 14ZM9.75 14C9.75 13.5858 10.0858 13.25 10.5 13.25H17C17.4142 13.25 17.75 13.5858 17.75 14C17.75 14.4142 17.4142 14.75 17 14.75H10.5C10.0858 14.75 9.75 14.4142 9.75 14ZM6.25 17.5C6.25 17.0858 6.58579 16.75 7 16.75H7.5C7.91421 16.75 8.25 17.0858 8.25 17.5C8.25 17.9142 7.91421 18.25 7.5 18.25H7C6.58579 18.25 6.25 17.9142 6.25 17.5ZM9.75 17.5C9.75 17.0858 10.0858 16.75 10.5 16.75H17C17.4142 16.75 17.75 17.0858 17.75 17.5C17.75 17.9142 17.4142 18.25 17 18.25H10.5C10.0858 18.25 9.75 17.9142 9.75 17.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default IconDashboard;
