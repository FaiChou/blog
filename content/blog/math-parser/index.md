---
title: "加减乘除解释器"
date: "2021-11-17"
category: "dev"
emoji: "🧮"
---

这篇不知道怎么写, 首先名字就不知道该怎么起.
`ArithmeticParser` 这样的名字没见过, 索性直接用 `MathParser` 吧, 但其内容仅仅包括加减乘除和括号.
其次这篇内容也找不到重点, 因为这东西你要是掌握了, 根本不需要看教程, 要是不掌握吧, 你看再多的教程也是白搭.


用以下形式表示加减乘除以及括号的运算:

```
<expr> ::= <term> + <expr>
         | <term> - <expr>
         | <term>

<term> ::= <factor> * <term> 
         | <factor> / <term>
         | <factor>

<factor> ::= ( <expr> ) | Num
```

这东西应该都不陌生, 就不扯什么 BNF 递归下降等专业名词了. 因为我也没看懂. 所以应该如何用代码写出来呢?

首先输入一个表达式求值, 比如:

```
1+1
1 + 2
1 * 3
1 + 2 * 3
(1+2) * 3
((1+2)*3+4)*5
```

需要一个函数, 一个字符一个字符的过滤, 将当前有用的字符保存下来. 需要注意的有两点:

1. 如果是空格, 就给 pass 掉
2. 因为是一个一个字符, 如果遇到多位数, 需要累加, 比如 23, 需要 `2 * 10 + 3` 处理

所以代码如下:


```c
void next() {
  // skip white space
  while (*src == ' ' || *src == '\t') {
    src++;
  }
  // printf("%c\n", *src);
  token = *src++;
  if (token >= '0' && token <= '9') {
    token_val = token - '0';
    token = Num;

    while (*src >= '0' && *src <= '9') {
      token_val = token_val * 10 + *src - '0';
      src++;
    }
    return;
  }
}
```

`next()` 函数将当前数据保存到 `token`, 如果是数字, 将数字值保存到 `token_val` 上.

接下来就步入正题, 先考虑一种最简单的情况, 只有乘除, 所以代码应该是这样:


```c
int factor() { return token_val; }
int term() {
    int lval = factor();
    next();
    if (token == '*') {
        next();
        return lval * term();
    } else if (token == '/') {
        next();
        return lval * term();
    } else {
        return lval;
    }
}
```

这次再把括号加上, 虽然都是乘除法, 但也塞上括号吧:

```c
int factor() {
    int v = 0;
    if (token == '('){
        next();
        v = term();
    } else {
        v = token_val;
    }
    return v;
}
int term() {
    int lval = factor();
    next();
    if (token == '*') {
        next();
        return lval * term();
    } else if (token == '/') {
        next();
        return lval * term();
    } else {
        return lval;
    }
}
```

在 `factor()` 函数内做判断, 如果遇到了括号, 那么括号内部的数据也是一个 `term` 所以用递归的形式来获取括号内的值.

这里就会遇到一个问题, 这程序是如何判断括号结束的呢? 比如 `(1*2*3)*4`, 当程序走到递归 `term` 处理到数字 3 时候, 再往下(此时还是在 `term` 里)遇到的是 `)`, 它既不是乘也不是除, 所以会直接 return. 故返回到 `factor` 递归位置.


加上加减法:

```c
int factor() {
    int v = 0;
    if (token == '('){
        next();
        v = expr(); // 这里换成了 expr
    } else {
        v = token_val;
    }
    return v;
}
int term() {
    int lval = factor();
    next();
    if (token == '*') {
        next();
        return lval * term();
    } else if (token == '/') {
        next();
        return lval * term();
    } else {
        return lval;
    }
}
int expr() {
    int lval = term();
    next();
    if (token == '+') {
        next();
        return lval + term();
    } else if (token == '-') {
        next();
        return lval - term();
    } else {
        return lval;
    }
}
```

写到这里, 你会遇到一个 bug, 计算 `1+2` 时候会得出 1. 因为在 `expr` 里有 `next`, 在 `term` 里也有 `next`, 在 `term` 里已经往下挪一位了后, `expr` 再挪一位, 就遇不到正确的符号, 故直接返回. 所以应该只保留一个 `next`. 将 `expr` 里的 `next` 删除即可.

但代码看着还是有点丑陋. 因为在 `term` 里进行 `next` 很别扭, 应该将其放在 `factor` 里, `factor` 才是最基础的数值, 应当在获取数值的函数里进行移位, 这样比较符合逻辑. 所以最终代码是:

```c
int factor() {
  int v = 0;
  if (token == '(') {
    next();
    v = expr();
    next();
  } else {
    v = token_val;
    next();
  }
  return v;
}
int term() {
  int lvalue = factor();
  if (token == '*') {
    next();
    return lvalue * term();
  } else if (token == '/') {
    next();
    return lvalue / term();
  } else {
    return lvalue;
  }
}
int expr() {
  int lvalue = term();
  if (token == '+') {
    next();
    return lvalue + expr();
  } else if (token == '-') {
    next();
    return lvalue - expr();
  } else {
    return lvalue;
  }
}
```

## 关于异常捕获

表达式写的有问题时候, 比如非数学的字符, 或者括号不匹配等问题, 或者除以 0 问题, 都需要抛出异常, 留一个家庭作业吧!


## 最终的代码

可以在我的 GitHub 上找到: 👉[传送门](https://github.com/FaiChou/c-tutorial/blob/main/recursive_descent_parser.c)👈

