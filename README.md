node-localhost
==============

A simple HTTP server with LiveReload


## Installation

```
$ npm install -g tilleps-localhost
```


## Uninstall
```
$ npm uninstall -g tilleps-localhost
```


## Usage    

```
Usage: localhost [options] <directory>

Options:

  -h, --help                 output usage information
  -V, --version              output the version number
  --host [host]              the host to bind to [localhost]
  --port [port]              the port to bind to [8080]
  --live-reload-port [port]  the port to start LiveReload on [35729]
  --no-color                 disable colored output
```


## Todo

- allow globs (use Gaze lib)
- tests


## License 

(The ISC License)

Copyright (c) 2014 Eugene Song &lt;tilleps@gmail.com&gt;

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
