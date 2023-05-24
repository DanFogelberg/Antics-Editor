import styled from "styled-components";
import React from "react";
import "../Preview/Preview.css";

const PreviewContainer = styled.div`
  width: 40vw;
  height: 70vh;
  background-color: whitesmoke;
  border: 1px solid black;
`;

export const Preview = (props) => {
  const text: string = props.text;
  const textArray: string[] = text.split("\n");
  console.log(textArray);
  return (
    <PreviewContainer>
      {textArray.map((text) => {
        if (text.startsWith("###")) {
          return <h3>{text.replace(/^###/, "")}</h3>;
        } else if (text.startsWith("##")) {
          return <h2>{text.replace(/^##/, "")}</h2>;
        } else if (text.startsWith("#")) {
          return <h1>{text.replace(/^#/, "")}</h1>;
        }
        return <p>{text}</p>;
      })}
    </PreviewContainer>
  );
};
