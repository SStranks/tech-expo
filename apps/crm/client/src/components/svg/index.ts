export type Props = {
  mirror?: boolean;
  svgClass?: string;
};
export type SvgIcon = ({ svgClass }: Props) => React.JSX.Element;
