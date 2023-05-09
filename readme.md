# Phase 2 Ceremony in the Browser


This project contains a front end and a server to conduct a phase 2 ceremony with random strangers who don't know how to code.


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

## Deployment
Run the application using PM2 on a VPS and install NGINX

The nginxconfig is configured to use snarkyceremonies.com domain. Update it to your own.
Hosted on an Ubuntu or Debian VPS

## Server setup

`sudo apt update`

`sudo apt upgrade`

`adduser snarky`

`usermod -aG sudo snarky`

`sudo apt install nginx`

## Snap is needed due to certbot install
`sudo apt install snapd`

`sudo snap install --classic certbot`

`sudo ln -s /snap/bin/certbot /usr/bin/certbot`

`sudo certbot --nginx`

## nodejs install

`curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -`

`sudo apt-get install -y nodejs`

`npm install -g pm2`

`pm2 startup systemd`

Clone this project from github

Install the dependencies,build the front end and run the server with pm2 from the snarky user.

copy the nginxconfig sites-available
`cp /home/snarky/phase2Ceremony/nginxconfig /etc/nginx/sites-available/default `

then reload nginx
`sudo systemctl reload nginx`
## Don't forget to copy 1 .ptau and 1 .r1cs file to /otherfiles and at least 1 .zkey to /zkeys
Everything in the /zkeys directory is public!! only store .zkey files there otherwise there will be errors!!

The log file will be created in the /otherfiles directory! It will be also served publicly.

All the files copied to /public are also public!

## Run the server

`chmod a+x run.sh` 

`./run.sh`


