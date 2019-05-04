import { createGlobalStyle } from "styled-components";

const globalStyle = createGlobalStyle`
  /* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
  */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
  }
  html, body {
    height: 100%;
  }
  body {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.background};
    line-height: 1.6;
    font-size: 100%;
    font-weight: 400;
    font-family: "Open Sans", Arial, -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  a {
    color: ${props => props.theme.colors.highlight};
    text-decoration: none;
    transition: .2s;
    :focus{
      outline: none;
    }
  }
  ol, ul, li {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote::before, blockquote::after,
  q::before, q::after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  * {
    box-sizing: border-box;
  }
  img {
  	max-width: 100%;
  }
  button,
  input {
    font-family: inherit;
    font-size: inherit;
    background: none;
    border: none;
    outline: none;
    appearance: none;
    border-radius: 0;
    resize: none;
    &:focus {
      outline: none;
    }
  }
  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    body:before {
      right: 0;
      top: 0;
      left: 0;
      height: 100px;
      z-index: 2147483647;
      position: fixed;
      content: "";
      display: block;
      transform: translateY(-99.99px);
      background: linear-gradient(124deg,
        #FF0000,
        #FF7F00,
        #FFFF00,
        #7FFF00,
        #00FF00,
        #00FF7F,
        #00FFFF,
        #007FFF,
        #0000FF,
        #7F00FF,
        #FF00FF,
        #FF007F,
        #FF0000);
      animation: rainbow 15s ease infinite;
      background-size: 1000% 1000%;
    }
  }
  @keyframes rainbow {
    0% {
      background-position: 0% 80%;
    }
    50% {
      background-position: 100% 20%;
    }
    100% {
      background-position: 0% 80%;
    }
  }
`;
export default globalStyle;
