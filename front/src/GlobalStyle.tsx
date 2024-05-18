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

  :root {
    --grid-item-max-width: 500px;
    --grid-item-min-width: 310px;
    --grid-items-per-row: 2;
    --grid-item-margin: 12px;
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
