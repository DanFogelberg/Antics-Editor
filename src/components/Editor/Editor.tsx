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
    const newText =
      text.slice(0, currentPosition) + "b{}b" + text.slice(currentPosition);
    handleChange(newText, 2);
  };

  const setCursive = () => {
    const currentPosition: number | undefined =
      textAreaRef.current?.selectionStart;
    textAreaRef.current?.focus();
    const newText =
      text.slice(0, currentPosition) + "c{}c" + text.slice(currentPosition);
    handleChange(newText, 2);
  };
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleChange: Function = (
    newText: string,
    positionOffset: number = 0
  ) => {
    const currentPosition: number | undefined =
      textAreaRef.current?.selectionStart;
    console.log(currentPosition);
    const currentLineIndex: number = newText
      .substring(0, currentPosition)
      .lastIndexOf("\n");
    console.log(currentLineIndex);
    console.log(newText[currentLineIndex]);

    let newHeading: string = "";
    while (newText.substring(currentLineIndex + 1).startsWith("#")) {
      newText =
        newText.slice(0, currentLineIndex + 1) +
        newText.slice(currentLineIndex + 2);
      positionOffset--;
    }

    switch (heading) {
      case "h1":
        newHeading = "#";
        positionOffset++;
        break;
      case "h2":
        newHeading = "##";
        positionOffset += 2;
        break;
      case "h3":
        newHeading = "###";
        positionOffset += 3;
        break;
    }

    newText =
      newText.slice(0, currentLineIndex + 1) +
      newHeading +
      newText.slice(currentLineIndex + 1);
    props.setText(newText);
    console.log(newText);
    setText(newText);
    if (textAreaRef.current) textAreaRef.current.value = newText;
    if (textAreaRef.current && currentPosition)
      textAreaRef.current.setSelectionRange(
        currentPosition + positionOffset,
        currentPosition + positionOffset
      );
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
        // value={text}
        ref={textAreaRef}
      ></TextArea>
    </EditorContainer>
  );
};
