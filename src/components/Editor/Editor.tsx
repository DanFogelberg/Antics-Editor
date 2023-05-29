import styled from "styled-components";
import React from "react";
// import { type } from "@testing-library/user-event/dist/type";

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
    const newText: string =
      text.slice(0, currentPosition) + "b{}b" + text.slice(currentPosition);
    handleChange(newText, 2); //Send new text to handleChange to update states and move cursor inside tags.
  };

  const setCursive = () => {
    const currentPosition: number | undefined =
      textAreaRef.current?.selectionStart;
    textAreaRef.current?.focus();
    const newText: string =
      text.slice(0, currentPosition) + "i{}i" + text.slice(currentPosition);
    handleChange(newText, 2); //Send new text to handleChange to update states and move cursor inside tags.
  };
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleChange: Function = (
    newText: string,
    positionOffset: number = 0
  ) => {
    const currentPosition: number | undefined =
      textAreaRef.current?.selectionStart;
    const currentLineIndex: number = newText
      .substring(0, currentPosition)
      .lastIndexOf("\n");

    //Remove all #. positionOffset is used to keep track of where to move cursor due to removed characters.
    while (newText.substring(currentLineIndex + 1).startsWith("#")) {
      newText =
        newText.slice(0, currentLineIndex + 1) +
        newText.slice(currentLineIndex + 2);
      positionOffset--;
    }

    let newHeading: string = "";
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

  //gör en array med shortcommands, där alla är satta till false, gör sen två funktioner, en som sätter en till true och en som sätter alla till false.
  const shortCuts: { [key: string]: boolean } = {
    command: false,
    b: false,
    i: false,
    zero: false,
    one: false,
    two: false,
    three: false,
  };

  //prata om det här, att vi typat upp ett event som använder react funktioner
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log(typeof e.key);
    console.log(e.key === "1");
    if (e.metaKey) shortCuts["command"] = true;
    if (e.key === "b") shortCuts["b"] = true;
    if (e.key === "i") shortCuts["i"] = true;
    if (e.key == "0") shortCuts["zero"] = true;
    if (e.key === "1") shortCuts["one"] = true;
    if (e.key === "2") shortCuts["two"] = true;
    if (e.key === "3") shortCuts["three"] = true;
    if (shortCuts["command"] && shortCuts["b"]) setBold();
    if (shortCuts["command"] && shortCuts["i"]) setCursive();
    if (shortCuts["command"] && shortCuts["zero"]) {
      e.preventDefault(); // Prevent the default browser behavior
      handleHeading("regular"); // Set the select value to "regular"
    }

    if (shortCuts["command"] && shortCuts["one"]) {
      e.preventDefault(); // Prevent the default browser behavior
      handleHeading("h1"); // Set the select value to "h1"
    }

    if (shortCuts["command"] && shortCuts["two"]) {
      e.preventDefault(); // Prevent the default browser behavior
      handleHeading("h2"); // Set the select value to "h2"
    }

    if (shortCuts["command"] && shortCuts["three"]) {
      e.preventDefault(); // Prevent the default browser behavior
      handleHeading("h3"); // Set the select value to "h3"
    }
    console.log(shortCuts);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.altKey) shortCuts["alternative"] = false;
    if (e.metaKey) shortCuts["command"] = false;
    if (e.key === "b") shortCuts["b"] = false;
    if (e.key === "i") shortCuts["i"] = false;
    if (e.key === "0") shortCuts["zero"] = false;
    if (e.key === "1") shortCuts["one"] = false;
    if (e.key === "2") shortCuts["two"] = false;
    if (e.key === "3") shortCuts["three"] = false;
    // console.log(shortCuts);
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
        placeholder="# = h1, ## = h2, ### = h3, enter = new line, b{...}b = bold, i{...}i = cursive"
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
        onKeyUp={(e) => handleKeyUp(e)}
        ref={textAreaRef}
      ></TextArea>
    </EditorContainer>
  );
};
