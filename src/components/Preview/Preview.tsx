import styled from "styled-components";
import React from "react";

const PreviewContainer = styled.div`
  width: 40vw;
  height: 70vh;
  background-color: whitesmoke;
  border: 1px solid black;
`;

export const Preview = (props) => {
  return <PreviewContainer>{props.text}</PreviewContainer>;
};
