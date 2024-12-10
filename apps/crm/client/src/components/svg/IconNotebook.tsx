import type { IProps } from './';

function IconNotebook({ svgClass = undefined }: IProps): React.JSX.Element {
  return (
    <svg className={svgClass} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon Notebook</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.75 4.93323C22.75 3.46992 21.5847 2.21498 20.0559 2.26824C18.9175 2.30789 17.4296 2.4263 16.2849 2.76899C15.2899 3.06687 14.1706 3.64872 13.2982 4.15366C12.4801 4.62712 11.4617 4.65074 10.6328 4.21248C9.63736 3.68609 8.32766 3.06215 7.19136 2.7623C6.23055 2.50876 5.01517 2.38698 4.02841 2.32634C2.47017 2.23057 1.25 3.49868 1.25 4.99784V16.1436C1.25 17.6798 2.49378 18.8792 3.96804 18.9714C4.9268 19.0314 6.00566 19.1467 6.80864 19.3586C7.8012 19.6205 9.0286 20.2029 10.0196 20.7311C11.2529 21.3885 12.7471 21.3885 13.9804 20.7311C14.9714 20.2029 16.1988 19.6205 17.1914 19.3586C17.9943 19.1467 19.0732 19.0314 20.032 18.9714C21.5062 18.8792 22.75 17.6798 22.75 16.1436V4.93323ZM20.1081 3.76733C20.7229 3.74591 21.25 4.25164 21.25 4.93323V16.1436C21.25 16.8294 20.6817 17.4278 19.9383 17.4743C18.9582 17.5356 17.7591 17.6574 16.8086 17.9082C15.6383 18.2171 14.2827 18.8701 13.2748 19.4074C13.1065 19.4971 12.9305 19.5678 12.75 19.6194V5.94207C13.2023 5.85153 13.6421 5.68771 14.0495 5.45191C14.9 4.95972 15.8949 4.45152 16.7151 4.20597C17.6643 3.92182 18.9892 3.8063 20.1081 3.76733ZM11.25 5.97501C10.795 5.90426 10.349 5.75918 9.93167 5.53851C8.95486 5.022 7.77076 4.46654 6.80864 4.21266C5.99643 3.99833 4.90238 3.88288 3.93639 3.82351C3.30243 3.78455 2.75 4.30065 2.75 4.99784V16.1436C2.75 16.8294 3.31831 17.4278 4.06168 17.4743C5.04176 17.5356 6.24092 17.6574 7.19136 17.9082C8.3617 18.2171 9.71727 18.8701 10.7252 19.4074C10.8935 19.4971 11.0695 19.5678 11.25 19.6194V5.97501Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default IconNotebook;
