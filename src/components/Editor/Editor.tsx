import styled from "styled-components";
import React from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Button } from "../Button/Button";
import "./Editor.css";

// import { type } from "@testing-library/user-event/dist/type";

const EditorContainer = styled.div`
  width: 40vw;
  height: 70vh;
  background-color: whitesmoke;
  border: 1px solid black;
`;

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL
  ? import.meta.env.VITE_SUPABASE_URL
  : "";
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY
  ? import.meta.env.VITE_SUPABASE_KEY
  : "";
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

const titles = await supabase.from("documents").select("title, id");
console.log(titles);

const TextArea = styled.textarea`
  width: 100%;
  height: 68vh;
  resize: none;
  padding: 0;
  border: 0;
  font-family: "Times New Roman", Times, serif;
  font-size: 16px;
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
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const titleRef = React.useRef<HTMLInputElement>(null);
  const titleSelectRef = React.useRef<HTMLInputElement>(null);

  const postDocument = async (
    title: string | undefined,
    text: string | undefined
  ) => {
    if (!title || !text) return;
    const result = await supabase
      .from("documents")
      .insert({ text: text, title: title });
    console.log(result);
  };

  const handleDocumentChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const option = e.target.selectedOptions[0];
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", option.id);
    console.log(data[0].text); //Add type to remove error.

    if (titleRef.current) titleRef.current.value = data[0].title;
    if (textAreaRef.current) textAreaRef.current.value = data[0].text;
    props.setText(data[0].text);
  };

  //function to handle select change and set heading to the new value. when u change the select value, the cursor is moved to the end of the text. This is why we call handleChange to move the cursor inside the tags.
  const handleHeading = (newHeading: string) => {
    heading = newHeading;
    textAreaRef.current?.focus();
    handleChange(textAreaRef.current?.value);
  };

  //function to place or custom boldtags and place the cursor inside them
  const setBold = () => {
    let text: string = "";
    if (textAreaRef.current) text = textAreaRef.current.value;
    const currentPosition: number | undefined =
      textAreaRef.current?.selectionStart;
    textAreaRef.current?.focus();
    const newText: string =
      text.slice(0, currentPosition) + "b{}b" + text.slice(currentPosition);
    handleChange(newText, 2); //Send new text to handleChange to update states and move cursor inside tags.
  };

  //function to place or custom cursive tags and place the cursor inside them
  const setCursive = () => {
    let text: string = "";
    if (textAreaRef.current) text = textAreaRef.current.value;
    const currentPosition: number | undefined =
      textAreaRef.current?.selectionStart;
    textAreaRef.current?.focus();
    const newText: string =
      text.slice(0, currentPosition) + "i{}i" + text.slice(currentPosition);
    handleChange(newText, 2); //Send new text to handleChange to update states and move cursor inside tags.
  };

  const handleChange: Function = (
    newText: string,
    positionOffset: number = 0
  ) => {
    //find the index of the cursor.
    const currentPosition: number | undefined =
      textAreaRef.current?.selectionStart;
    //find the index of the last linebreak before the cursor.
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
    //Depending on which heading you are useing, add the corresponding amount of # and place the cursor after them.
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
    if (textAreaRef.current) textAreaRef.current.value = newText;
    if (textAreaRef.current && currentPosition)
      textAreaRef.current.setSelectionRange(
        currentPosition + positionOffset,
        currentPosition + positionOffset
      );
  };

  //Object to keep track of which keys are pressed.
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
  //function to handle keydown events and set the corresponding key in the shortCuts object to true. If certain combinations of keys are pressed, call the corresponding function.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.metaKey) shortCuts["command"] = true;
    if (e.key === "b") shortCuts["b"] = true;
    if (e.key === "i") shortCuts["i"] = true;
    if (e.key == "0") shortCuts["zero"] = true;
    if (e.key === "1") shortCuts["one"] = true;
    if (e.key === "2") shortCuts["two"] = true;
    if (e.key === "3") shortCuts["three"] = true;
    if (shortCuts["command"] && shortCuts["b"]) setBold(); // If command and b is pressed, call setBold()
    if (shortCuts["command"] && shortCuts["i"]) setCursive(); // If command and i is pressed, call setCursive()
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
  };

  //function to handle keyup events and set the corresponding key in the shortCuts object to false reseting the object.
  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.altKey) shortCuts["alternative"] = false;
    if (e.metaKey) shortCuts["command"] = false;
    if (e.key === "b") shortCuts["b"] = false;
    if (e.key === "i") shortCuts["i"] = false;
    if (e.key === "0") shortCuts["zero"] = false;
    if (e.key === "1") shortCuts["one"] = false;
    if (e.key === "2") shortCuts["two"] = false;
    if (e.key === "3") shortCuts["three"] = false;
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
        <Button handleClick={() => setBold()} className="boldButton" text="b" />

        <Button
          handleClick={() => setCursive()}
          className="italicButton"
          text="i"
        />

        <input type="text" placeholder="Title" ref={titleRef}></input>
        <Button
          handleClick={async () => {
            postDocument(titleRef.current?.value, textAreaRef.current?.value);
            // titles = await supabase.from("documents").select("title, id");

            // fetch datata again here aswell after save
          }}
          className="hej"
          text="Save"
        />
        <select onChange={(e) => handleDocumentChange(e)}>
          <option value="" disabled selected>
            New document
          </option>
          {titles.data?.map((title) => {
            return (
              <option value={title.title} id={title.id} key={title.id}>
                {title.title}
              </option>
            );
          })}
        </select>
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
