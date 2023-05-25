import styled from "styled-components";
import React from "react";
import "../Preview/Preview.css";

const PreviewContainer = styled.div`
  width: 40vw;
  height: 70vh;
  background-color: whitesmoke;
  border: 1px solid black;
  white-space: pre-line;
`;

type PreviewProps = {
  text: string;
}

export const Preview = (props: PreviewProps) => {
  const text: string = props.text;
  const textArray: string[] = text.split("\n");
  console.log(textArray);
  console.log(text);
  return (
    <PreviewContainer>
      {textArray.map((text) => {
        switch (true) {
          case text.startsWith("###"):
            return <h3>{text.replace(/^###/, "")}</h3>;
          case text.startsWith("##"):
            return <h2>{text.replace(/^##/, "")}</h2>;
          case text.startsWith("#"):
            return <h1>{text.replace(/^#/, "")}</h1>;
          default:
            return <p>{text}</p>;
        }
        // Leta efter occurence av t.ex. "b{}" och ersätt med bold.
      })}
    </PreviewContainer>
  );
};
