import type { IProps } from './';

function IconArrowLeftDoubleAlt({ mirror = undefined, svgClass = undefined }: IProps): React.JSX.Element {
  return (
    <svg className={svgClass} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon Arrow Left Double</title>
      <path
        style={mirror ? { transform: 'scaleX(-1)', transformOrigin: 'center' } : {}}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.4879 4.43057C17.8024 4.70014 17.8388 5.17361 17.5693 5.48811L11.9876 12L17.5693 18.5119C17.8388 18.8264 17.8024 19.2999 17.4879 19.5695C17.1734 19.839 16.6999 19.8026 16.4304 19.4881L10.4304 12.4881C10.1896 12.2072 10.1896 11.7928 10.4304 11.5119L16.4304 4.51192C16.6999 4.19743 17.1734 4.161 17.4879 4.43057ZM13.488 4.43067C13.8025 4.70024 13.8389 5.17372 13.5694 5.48821L7.98772 12.0001L13.5694 18.512C13.8389 18.8265 13.8025 19.3 13.488 19.5696C13.1735 19.8391 12.7 19.8027 12.4305 19.4882L6.43047 12.4882C6.18972 12.2073 6.18972 11.7929 6.43047 11.512L12.4305 4.51202C12.7 4.19753 13.1735 4.16111 13.488 4.43067Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default IconArrowLeftDoubleAlt;
