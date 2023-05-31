import styled from "styled-components";
import "./Preview.css";

const PreviewContainer = styled.div`
  width: 40vw;
  height: 70vh;
  background-color: whitesmoke;
  border: 1px solid black;
  white-space: break-spaces;
  font-family: "Times New Roman", Times, serif;
  word-break: break-all;
`;

type PreviewProps = {
  text: string;
};

export const Preview = (props: PreviewProps) => {
  const text: string = props.text;
  console.log(text);

  //makes the text into an array of strings, each string is a line of text.
  const textArray: string[] = text.split("\n");

  //for each line of text, check if it starts with any of the markdown tags. If it does, replace the tag with the corresponding html tag. To be safe while using dangerouslySetInnerHTML we remove all html tags from the text so you cant inject any dangerous code.
  return (
    <div>
      <h1 className="title">Preview</h1>
      <PreviewContainer>
        {textArray.map((text, id) => {
          //Remove all htmltags for safety.
          while (text.includes("<")) text = text.replace("<", "");
          while (text.includes(">")) text = text.replace(">", "");

          // Replace all occurrences of b{..}b and "i{...}i" with "<b>...</b>" and "<i>...</i>".
          while (text.includes("b{") && text.includes("}b"))
            text = text.replace(/b\{(.*?)\}b/g, "<b>$1</b>");
          while (text.includes("i{") && text.includes("}i"))
            text = text.replace(/i\{(.*?)\}i/g, "<i>$1</i>");
          // while (text === " ") text = text.replace("\n");

          switch (true) {
            case text.startsWith("###"):
              return (
                <h3
                  dangerouslySetInnerHTML={{ __html: text.replace(/^###/, "") }}
                  key={id}
                />
              );
            case text.startsWith("##"):
              return (
                <h2
                  dangerouslySetInnerHTML={{ __html: text.replace(/^##/, "") }}
                  key={id}
                />
              );
            case text.startsWith("#"):
              return (
                <h1
                  dangerouslySetInnerHTML={{ __html: text.replace(/^#/, "") }}
                  key={id}
                />
              );
            default:
              return <p dangerouslySetInnerHTML={{ __html: text }} key={id} />;
          }
        })}
      </PreviewContainer>
    </div>
  );
};
