type ButtonProps = {
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className: string;
  text: string;
};

export const Button = (props: ButtonProps) => {
  return (
    <button className={props.className} onClick={props.handleClick}>
      {props.text}
    </button>
  );
};
