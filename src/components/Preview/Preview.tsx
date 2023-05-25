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
};

export const Preview = (props: PreviewProps) => {
  const text: string = props.text;
  const textArray: string[] = text.split("\n");
  const wordArray: string[] = text.split(" ");
  console.log(textArray);
  console.log(text);
  return (
    <PreviewContainer>
      {textArray.map((text) => {
        //map each word in textArray and return a new array with the words

        //bryt varje gång du har en öppnande tagg och en stängande tagg och gör om till bold

        text = text.replace(/b\{(.*?)\}b/g, "<b>$1</b>");

        // Replace occurrences of "c{...}c" with "<i>...</i>"
        text = text.replace(/c\{(.*?)\}c/g, "<i>$1</i>");

        switch (true) {
          case text.startsWith("###"):
            return <h3>{text.replace(/^###/, "")}</h3>;
          case text.startsWith("##"):
            return <h2>{text.replace(/^##/, "")}</h2>;
          case text.startsWith("#"):
            return <h1>{text.replace(/^#/, "")}</h1>;

          //Make sure to validate and sanitize the input appropriately to prevent any security risks.
          default:
            return <p dangerouslySetInnerHTML={{ __html: text }} />;
        }
        // Leta efter occurence av t.ex. "b{}" och ersätt med bold.
      })}
    </PreviewContainer>
  );
};
