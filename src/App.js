import React from "react";
import styled from "styled-components";
import { Editor } from "./components/Editor/Editor.tsx";
import { Preview } from "./components/Preview/Preview.tsx";

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
//gör till komponent

function App() {
  return (
    <div className="App">
      <ContentWrapper>
        <Editor />
        <Preview />
      </ContentWrapper>
    </div>
  );
}

export default App;
