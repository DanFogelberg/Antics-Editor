import styled from "styled-components";
import "./Commands.css";

const CommandContainer = styled.div`
  height: 10rem;
  width: 15rem;
  background-color: whitesmoke;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Commands = () => {
  return (
    <CommandContainer>
      <h2>Commands</h2>
      <ul>
        <li>Heading 1 = ⌘ + 1</li>
        <li>Heading 2 = ⌘ + 2</li>
        <li>Heading 3 = ⌘ + 3</li>
        <li>Bold = ⌘ + b</li>
        <li>Italic = ⌘ + i</li>
      </ul>
    </CommandContainer>
  );
};
