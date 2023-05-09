# Phase 2 Ceremony in the Browser


This project contains a front end and  a server to conduct a phase 2 ceremony with random strangers on the internet.

WORK IN PROGRESS

## How to use

Build the front end first.

`cd frontend`

`npm install`

`npm run build`

The front end uses a forked snarkjs that a added support for crypto polyfills, this was the workaround:

https://github.com/StrawberryChocolateFudge/snarkjs/commit/2d8fd0cbee9f09a3838afb0bcf426b9ea32808c4

The main application uses these global variables for polyfill support

```
import * as cryptoBrowserify from "crypto-browserify";
import buffer from "buffer/";

//@ts-ignore
window.cryptoBrowserify = cryptoBrowserify;

//@ts-ignore
window.Buffer = buffer.Buffer;

```

Now you need to set up the server

`cd server`

`npm install`

Copy your zkeys to the `zkeys` directory. 

The r1cs and the final .ptau file that was used must be also copied to the `othefiles` directory. The server will verify uploads using those!

The naming convention for zkey is very important!!
This is the regex used for parsing names:

`/(?<name>\w+)_(?<id>[\d.]+).zkey/g`

Here is an example: withdraw_0001.zkey;

So the scheme is the following {name}_{id}.zkey

The name can be anything, the name of the circuit, the id is the number that is incremented so the first contribution is 0001 and second 0002 etc.

Run the application using PM2 on a VPS and install NGINX

TODO:...


