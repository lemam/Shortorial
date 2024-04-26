import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
  }

  button {
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
