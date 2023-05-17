import styled from "styled-components";
import React from "react";
const EditorContainer = styled.textarea`
  width: 40vw;
  height: 70vh;
  background-color: whitesmoke;
  border: 1px solid black;
`;

export const Editor = () => {
  return (
    <EditorContainer>
      <textarea></textarea>
    </EditorContainer>
  );
};
