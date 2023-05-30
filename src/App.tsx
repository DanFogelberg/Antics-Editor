import { useState, useCallback } from "react";
import styled from "styled-components";
import { Editor } from "./components/Editor/Editor.tsx";
import { Preview } from "./components/Preview/Preview.tsx";

import { Commands } from "./components/Commands/Commands.tsx";
import "./App.css";
//Bugg som gör att vi inte kan ha .tsx filer i import. Ändra i import package.json filen för att lösa detta.

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

//Limit type to string

function App() {
  const [text, setText] = useState("");
  const updateText = useCallback((newText: string) => {
    setText(newText);
  }, []);


  return (
    <div className="App">
      <ContentWrapper>
        <Editor setText={updateText} />
        <Preview text={text} />
      </ContentWrapper>
      <Commands />
    </div>
  );
}

export default App;
