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
  display: flex;
  flex-direction: row;
`;

type EditorProps = {
  setText: Function;
};

//ta emot setText och typa upp det

let heading: string = "regular";

export const Editor = (props: EditorProps) => {
  const [text, setText] = React.useState("");
  const handleHeading = (newHeading: string) => {
    heading = newHeading;
    textAreaRef.current?.focus();
    handleChange(text);
  };
  const setBold = () => {
    const currentPosition: number | undefined =
      textAreaRef.current?.selectionStart;
    textAreaRef.current?.focus();
    setText(
      text.slice(0, currentPosition) + "b{}" + text.slice(currentPosition)
    );
  };

  const setCursive = () => {
    const currentPosition: number | undefined =
      textAreaRef.current?.selectionStart;
    textAreaRef.current?.focus();
    setText(
      text.slice(0, currentPosition) + "c{}" + text.slice(currentPosition)
    );
  };
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleChange: Function = (newText: string) => {
    // hitta enter tecknet och lägg in #, ##, ### beroende på heading
    const currentPosition: number | undefined =
      textAreaRef.current?.selectionStart;
    console.log(currentPosition);
    const currentLineIndex: number = newText
      .substring(0, currentPosition)
      .lastIndexOf("\n");
    console.log(currentLineIndex);
    console.log(newText[currentLineIndex]);

    let newHeading: string = "";
    while (newText.substring(currentLineIndex + 1).startsWith("#"))
      newText =
        newText.slice(0, currentLineIndex + 1) +
        newText.slice(currentLineIndex + 2);
    switch (heading) {
      case "h1":
        newHeading = "#";
        break;
      case "h2":
        newHeading = "##";
        break;
      case "h3":
        newHeading = "###";
        break;
    }

    newText =
      newText.slice(0, currentLineIndex + 1) +
      newHeading +
      newText.slice(currentLineIndex + 1);
    props.setText(newText);
    console.log(newText);
    setText(newText);
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
        <button onClick={(e) => setBold()}>B</button>
        <button onClick={(e) => setCursive()}>C</button>
      </EditorInterface>
      <TextArea
        placeholder="# = h1, ## = h2, ### = h3, enter = new line"
        onChange={(e) => handleChange(e.target.value)}
        value={text}
        ref={textAreaRef}
      ></TextArea>
    </EditorContainer>
  );
};
