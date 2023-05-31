import styled from "styled-components";
import "./Commands.css";

const CommandContainer = styled.div`
  height: 10rem;
  width: 15rem;
  background-color: #161b22;
  color: white;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Roboto", sans-serif;
  margin-left: 32.3vw;
  margin-top: 5.8vh;
  border-left: 2px solid white;
  border-bottom: 2px solid white;
  border-right: 2px solid white;
  border-top: 2px solid white;
`;

export const Commands = () => {
  return (
    <CommandContainer>
      <h2 className="commandHeading">Commands</h2>
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
