import styled from "styled-components";
import React from "react";

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
          return <h3>{text}</h3>;
        } else if (text.startsWith("##")) {
          return <h2>{text}</h2>;
        } else if (text.startsWith("#")) {
          return <h1>{text}</h1>;
        }
        return <p>{text}</p>;
      })}
    </PreviewContainer>
  );
};
