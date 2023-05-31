import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Button } from "../Button/Button";
import "./Editor.css";

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

type document = {
  id: number;
  text: string;
  title: string;
  created_at: string;
};

type titleObject = {
  id: number;
  title: string;
};

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL
  ? import.meta.env.VITE_SUPABASE_URL
  : "";
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY
  ? import.meta.env.VITE_SUPABASE_KEY
  : "";
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

let heading: string = "regular";
let emptyTitles: titleObject[] = [];

export const Editor = (props: EditorProps) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const titleRef = React.useRef<HTMLInputElement>(null);
  const [titles, setTitles]: [
    titles: titleObject[],
    setTitles: React.Dispatch<React.SetStateAction<titleObject[]>>
  ] = useState(emptyTitles); //**För att typa titles  måste vi type setTitles

  useEffect(() => {
    fetchTitles().then((result) => setTitles(result));
  }, []);

  const fetchTitles = async (): Promise<titleObject[]> => {
    const response = await supabase.from("documents").select("title, id");
    let titles: titleObject[] = [];
    if (!response.data) return [];
    response.data.forEach((fetchedTitle) => {
      const titleObject: titleObject = { id: 0, title: "" };
      if (typeof fetchedTitle.id === "number") titleObject.id = fetchedTitle.id;
      if (typeof fetchedTitle.title === "string")
        titleObject.title = fetchedTitle.title;
      titles.push(titleObject);
    });

    return titles;
  };

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
    const response = await supabase
      .from("documents")
      .select("*")
      .eq("id", option.id);

    if (!response.data) return;

    const document: document = fetchDataToDocument(response.data[0]);

    if (titleRef.current) titleRef.current.value = document.title;
    if (textAreaRef.current) textAreaRef.current.value = document.text;
    props.setText(document.text);
  };

  const fetchDataToDocument = (fetchData: { [x: string]: any }): document => {
    let id: number = 0;
    let text: string = "";
    let title: string = "";
    let created_at: string = "";

    if (fetchData.id && typeof fetchData.id === typeof "number")
      id = fetchData.id;
    if (typeof fetchData.text === typeof "string") text = fetchData.text;
    if (typeof fetchData.title === typeof "title") title = fetchData.title;
    if (typeof fetchData.created_at === typeof "string")
      created_at = fetchData.created_at;

    const document: document = {
      id: id,
      text: text,
      title: title,
      created_at: created_at,
    };

    return document;
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
  //**Kan prata om denna funktionen lite mer, att vi typat upp den och att vi använder en object istället för att ha flera olika states.
  const shortCuts: { [key: string]: boolean } = {
    command: false,
    b: false,
    i: false,
    zero: false,
    one: false,
    two: false,
    three: false,
  };

  //function to handle keydown events and set the corresponding key in the shortCuts object to true. If certain combinations of keys are pressed, call the corresponding function.

  //**VISA DETTA EXEMPLET, om vi tar bort type React.KeyboardEvent<HTMLTextAreaElement> så får vi inte tillgång till e.key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.metaKey) shortCuts["command"] = true;
    if (e.key === "b") shortCuts["b"] = true;
    if (e.key === "i") shortCuts["i"] = true;
    if (e.key === "0") shortCuts["zero"] = true;
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

  //Updates heading to the heading of the line when you switch lines.
  const handleSelectionChange = (
    e: React.SyntheticEvent<HTMLTextAreaElement, Event>
  ) => {
    const textArea: EventTarget & HTMLTextAreaElement = e.currentTarget;

    console.log(textArea.selectionStart); //Type textarea better!

    //find the index of the cursor.
    const currentPosition: number | undefined = textArea.selectionStart;
    //find the index of the last linebreak before the cursor.
    const currentLineIndex: number =
      1 + textArea.value.substring(0, currentPosition).lastIndexOf("\n");

    if (textArea.value.substring(currentLineIndex).startsWith("###"))
      heading = "h3";
    else if (textArea.value.substring(currentLineIndex).startsWith("##"))
      heading = "h2";
    else if (textArea.value.substring(currentLineIndex).startsWith("#"))
      heading = "h1";
  };

  return (
    <div>
      <h1 className="title">Editor</h1>
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
          <Button
            handleClick={() => setBold()}
            className="boldButton"
            text="b"
          />

          <Button
            handleClick={() => setCursive()}
            className="italicButton"
            text="i"
          />

          <input type="text" placeholder="Title" ref={titleRef}></input>
          <Button
            handleClick={async () => {
              postDocument(titleRef.current?.value, textAreaRef.current?.value);
              fetchTitles().then((result) => setTitles(result));
            }}
            className="saveButton"
            text="Save"
          />
          <select
            defaultValue={"default"}
            onChange={(e) => handleDocumentChange(e)}
          >
            <option value="default" disabled>
              New document
            </option>
            {titles.map((title) => {
              return (
                <option
                  value={title.title}
                  id={title.id.toString()}
                  key={title.id}
                >
                  {title.title}
                </option>
              );
            })}
          </select>
        </EditorInterface>
        <TextArea
          placeholder="WELCOME TO THE ANTICS-EDITOR.  # = h1, ## = h2, ### = h3, enter = new line, b{...}b = bold, i{...}i = cursive"
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          onKeyUp={(e) => handleKeyUp(e)}
          onSelect={(e) => handleSelectionChange(e)}
          ref={textAreaRef}
        ></TextArea>
      </EditorContainer>
    </div>
  );
};
