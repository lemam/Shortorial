import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    position: relative;
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
  font-family: "Noto Sans KR", sans-serif;
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
