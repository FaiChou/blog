---
title: "Long time no see"
date: "2020-08-03"
category: "dev"
emoji: "🥺"
---

好几个月没写代码了, 自从离职后(5月初)就没接触代码, 今天想实现一个功能, 真的是吃力, 代码如下:

```JavaScript
function hideElementByClassName(className) {
  var collection = document.getElementsByClassName(className);
  var array = Array.from(collection);
  array.forEach(item => {
    item.classList.add("hide-when-printing");
  })
}
function hideElement(ele) {
  ele.classList.add("hide-when-printing");
}
function removeFirstNodeValueByClassName(className) {
  var collection = document.getElementsByClassName(className);
  var array = Array.from(collection);
  array.forEach(item => {
    item.firstChild.nodeValue = "";
  })
}
var observer = new MutationObserver(resetTimer);
var timer = setTimeout(action, 3000, observer);
observer.observe(document, {childList: true, subtree: true});

function resetTimer(changes, observer) {
  clearTimeout(timer);
  timer = setTimeout(action, 3000, observer);
}

function action(o) {
  o.disconnect();
  hideElementByClassName("order-details__line-item-total-price")
  hideElementByClassName("order-section__timeline")
  hideElementByClassName("order-details__summary__paid_by_customer")
  var summaryTable = document.getElementsByClassName('order-details-summary-table');
  if (summaryTable) {
    var rows = summaryTable[0].getElementsByTagName("tr");
    hideElement(rows[0]);
    hideElement(rows[2]);
    hideElement(rows[3]);
  }
  removeFirstNodeValueByClassName("order-details__price-by-quantity show-when-printing");
}
```

它的作用是在页面加载后重新对一些 `elements` 进行处理.

代码跑在 Tampermonkey 上.

没什么好解释的, 都是 vanilla js.
