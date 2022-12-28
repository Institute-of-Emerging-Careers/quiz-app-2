# Project Details
This is a Student Acquisition System consisting of 5 phases:
<ul>
  <li>Application</li>
  <li>Assessment</li>
  <li>Orientation</li>
  <li>Interview</li>
  <li>Onboarding</li>
</ul>

## Tech Stack
NodeJS (version 14) | ExpressJS |  ReactJS | MySQL v8.0.30 | Sequelize ORM |  AWS EC2 |  AWS SES | Redis v5.0.7 | Bull | Mocha | Chai<br>
For testing it uses Mocha & Chai.<br>
For emails it uses AWS SES and for email queues it uses Redis-Bull.

## Environment Variables Required

- `DEBUG` | set to `false` to disable certain console logs used for debugging. This feature is not fully implemented.
- `NODE_ENV` | `production`, `development`, or `test`/`testing`
- `SITE_DOMAIN_NAME` | the url of the website, like `https://www.website.com`
- `SESSION_SERET`
- `MYSQL_CONNECTION_STRING` | format: `mysql://username:password@localhost:3306/`
- `PORT` | e.g. `3000`
- `TIMEZIME_OFFSET` | offset of the server from Pakistan Standard Time, e.g. `+05:00`
- `AWS_SES_ACCESS_KEY_ID`
- `AWS_SES_SECRET_ACCESS_KEY`
- `AWS_SES_REGION`
- `QUIZ_DEADLINE_FROM_SIGNUP_IN_DAYS` | e.g. 30 (i.e. 30 days after a student is assigned a quiz, the deadline ends and student cannot solve the quiz anymore)


## Database Initialization

### MySQL
The application was developed on MySQL v8.0.30. All models are defined in `/models` using sequelize. Create an empty database in MySQL and mention its name in the `config` folder. By default the program expects the database to be named `quizdb`. 
In `db/initialize.js`, set `alterandforce = true` to initialize the empty database with some sample data upon server start. Set `alterandforce = false` afterwards.

### Redis
You need to install redis v5.0.7 and run it on port `6379` before running the server as well.

## Modules
To install required dependencies, run `npm install` in the project root. Make sure you have [Node v14 installed](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-22-04#option-3-installing-node-using-the-node-version-manager). 

## Customizations
You may want to change the fontawesome import link because it is a free link associated with my personal fontawesome account and is only allowed to be used on one website.

## EC2 Instance Hardware Requirements
MySQL requires 0.5Gb of RAM. If you try to use VS Code SSH-Remote on the server, you will need ~2Gb of RAM to be safe as [it is known to crash <=1Gb instances](https://github.com/microsoft/vscode-remote-release/issues/1110). So for smooth operation, the system must have 1-2Gb of RAM. With my testing, a `t3.small` instance on AWS EC2 works fine, though it does crash on using VS Code Remote sometimes.

## Building
To build javascript files optimized for production, you need to run `npm run build:babel` on production.

## Running
To finally start the server, run `npm run dev` for development or `npm start` for production.
