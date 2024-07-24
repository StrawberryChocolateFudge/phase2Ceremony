# DEPRECATION NOTICE
This phase-2 ceremony server is no longer maintained. The project has been superseded by NiftyZK which contains this exact ceremony server and let's you host your own ceremony more easily!
https://github.com/NiftyZk/niftyzk

# Non-opinionated Phase 2 Ceremonies in the Browser


This project contains a front end and a server to conduct a phase 2 ceremony with random strangers who don't know how to code.
The application is non-opinionated so it can be easily reused for many projects, just copy the files in the directories.

The contribution queue allows 25 connections. Up to 25 contributors can connect at once. The contribution is synchronous so they need to wait for their turn. A turn takes around 20 seconds with a remote VPS. If a connection lasts for longer than 60 seconds the contribution is aborted and the queue continues from the next participant. This is to mitigate DOS where an attacker would block the queue.


## How to use

Build the front end first.

`cd frontend`

`npm install`

`npm run build`

If you rebuild the front end multiple times, you might want to delete the dist directory before your build.
If the first build fails, you need to create a `/public` directory in the server folder where the contents will be copied!

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
When saving, the ids will be padded to be 4 digits long.

## Deployment
Run the application using PM2 on a VPS and install NGINX

The nginxconfig is configured to use snarkyceremonies.com domain. Update it to your own.
Hosted on an Ubuntu or Debian VPS. 

You can also choose to self host it at home on a raspberry pi. It should work but the config will be a bit different!

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


`su snarky`

Clone this project from github 

Install the dependencies, build the front end and run the server with pm2 from the snarky user.

copy the nginxconfig sites-available
`cp /home/snarky/phase2Ceremony/nginxconfig /etc/nginx/sites-available/default `

then reload nginx
`sudo systemctl reload nginx`

## Run the server

`chmod a+x run.sh` 

`./run.sh`

PM2 should run only a single instance of the server because it uses the memory for queueing websocket connections!
It could be scaled to cluster mode if a database layer is added with a locking mechanism to manage the queue, but for the current use-case that is not required.
We don't need too many participants for a phase 2 ceremony so a single thread will do.

## Files

Copy 1 .ptau and 1 .r1cs file to /otherfiles, if there are duplicate files with the same extensions the server will error on startup.

Copy at least 1 .zkey to /zkeys, this is the directory where the other keys will be saved to.

Everything in the /zkeys directory is public!! Only store .zkey files there otherwise there will be errors!!

A csv log file will be created in the /otherfiles directory! It will be also served publicly at `/log`

All the files copied to /public are also public! The front end build will automaticly copy the dist directory here!


## Verify your participation

To verify which one is your contribution you can access the logs at `/log` . You need the sha256 hash of the name you entered and if you can find it in the logs that is your contribution!

## How to customize

Edit the index.html file to update the website. No frameworks are used, so it is pretty straight forward.

You don't need to alter the server, just use the correct ptau,r1cs and zkey files and it will work.
