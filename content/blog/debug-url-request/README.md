---
title: "How to debug url request"
date: "2021-06-04"
category: "dev"
emoji: "🔗"
---

# Using cURL

```
$ curl -L -I -v fedex.com
```

Which `-L` makes it follow redirections, otherwise you can only reach the `301 page`.

`-I` can hide all response body, which is very very verbose.

`-v` makes the progress talkative, shows details of this request including DNS CA and so on.

or you can:

```
$ curl -L -s -o /dev/null -v fedex.com
```

Which send the response body output to the hell.


