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
  display: flex;
  margin-left: auto;
  margin-top: 5.8vh;
  border-left: 2px solid white;
  border-bottom: 2px solid white;
  border-right: 2px solid white;
  border-top: 2px solid white;
  gap: 5px;
`;

export const Commands = () => {
  return (
    <div className="invisibleBox">
      <div className="leftBox">
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
      </div>
      <div className="rightBox"> </div>
    </div>
  );
};
