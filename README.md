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
NodeJS (version 14) | ExpressJS |  ReactJS | MySQL | Sequelize ORM |  AWS EC2 |  AWS SES | Redis-Bull | Mocha | Chai<br>
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
All models are defined in `/models` using sequelize. Create an empty database in MySQL and mention its name in the `MYSQL_CONNECTION_STRING` in the `.env` file. 
In `db/initialize.js`, set `alterandforce = true` to initialize the empty database with some sample data upon server start. Set `alterandforce = false` afterwards.

### Redis
You need to install redis and run it on port `6379` before running the server as well.

## Modules
To install required dependencies, run `npm install` in the project root. Make sure you have [Node v14 installed](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-22-04#option-3-installing-node-using-the-node-version-manager). 

## Customizations
You may want to change the fontawesome import link because it is a free link associated with my personal fontawesome account and is only allowed to be used on one website. The version currently in use is v5.

## Server Hardware Requirements
MySQL requires 0.5Gb of RAM. The operating system, such as Ubunut, also uses 1-2Gb of RAM. So for smooth operation, the system must have 2Gb of RAM and more. 1-2 vCPUs are enough. With my testing, a `t3.small` instance on AWS EC2 works fine.

## Building
To build javascript files optimized for production, you need to run `npm run build:babel` on production.

## Running
To finally start the server, run `npm run dev` for development or `npm start` for production.
