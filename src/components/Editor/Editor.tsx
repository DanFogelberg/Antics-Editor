import styled from "styled-components";
import React from "react";

const EditorContainer = styled.div`
  width: 40vw;
  height: 70vh;
  background-color: whitesmoke;
  border: 1px solid black;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 68vh;
  resize: none;
  padding: 0;
  border: 0;
`;
const EditorInterface = styled.div`
  width: 40vw;
  height: 2vh;
  background-color: grey;
`;

type EditorProps = {
  setText: Function;
};

//ta emot setText och typa upp det

let text: string = "";
export const Editor = (props: EditorProps) => {
  const handleChange = (newText: string) => {
    // hitta enter tecknet och lägg in #, ##, ### beroende på heading

    if (heading === "h1") {
      if (newText.startsWith("#")) {
        props.setText(newText);
      } else {
        newText = `#${newText}`;
      }
    } else if (heading === "h2") {
      if (newText.startsWith("##")) {
        props.setText(newText);
      } else {
        newText = `##${newText}`;
      }
    } else if (heading === "h3") {
      if (newText.startsWith("###")) {
        props.setText(newText);
      } else {
        newText = `###${newText}`;
      }
    }
    props.setText(newText);
    console.log(newText);
    text = newText;
  };

  const [heading, setHeading] = React.useState("regular");
  const handleHeading = (value: string) => {
    setHeading(value);
  };

  return (
    <EditorContainer>
      <EditorInterface>
        <div className="headings">
          <select
            value={heading}
            onChange={(e) => handleHeading(e.target.value)}
          >
            <option value="regular">regular</option>
            <option value="h1">h1</option>
            <option value="h2">h2</option>
            <option value="h3">h3</option>
          </select>
        </div>
      </EditorInterface>
      <TextArea
        placeholder="# = h1, ## = h2, ### = h3, enter = new line"
        onChange={(e) => handleChange(e.target.value)}
        value={text}
      ></TextArea>
    </EditorContainer>
  );
};
