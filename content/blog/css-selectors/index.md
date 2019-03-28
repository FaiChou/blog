---
title: "CSS Selectors Note"
date: "2017-08-02"
category: "dev"
emoji: "🍉"
---

### CSS 选择器笔记

```css
* { margin:0; padding:0; } // all
p { font-size:2em; } // p
.info { background:#ff0; } // class="info"
p.info { background:#ff0; } // class="info" but in p
p.info.error { color:#900; font-weight:bold; }
#info { background:#ff0; } // id="info"
p#info { background:#ff0; } // id="info" but in p

h1, h2 { color: red } // h1 and h2
div p { color:#f00; } // all p under p
#nav li { display:inline; } // all li under id="nav"
#nav a { font-weight:bold; } // all a under id="nav"
div > strong { color:#f00; } // all strong of div's son
p + p { color:#f00; } // neighbor

p[title] { color:#f00; } // p with title attribute
div[class=error] { color:#f00; } // p with class=error
td[headers~=col1] { color:#f00; } // ..
p[lang|=en] { color:#f00; }
blockquote[class=quote][cite] { color:#f00; }

p:first-line { font-weight:bold; color;#600; } // p's first line
input[type=text]:focus { color:#000; background:#ffe; } // input on texting..
input[type=text]:focus:hover { background:#fff; }// input on texting or mouse on it

:link
:visited
:active
:hover
:focus
:first-child
:nth-child
:nth-last-child
:nth-of-type
:first-of-type
:last-of-type
:empty
:target
:checked
:enabled
:disabled

```

