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
NodeJS | ExpressJS |  ReactJS | MySQL | Sequelize ORM |  AWS EC2 |  AWS SES | Redis-Bull | Mocha | Chai<br>
For testing it uses Mocha & Chai.<br>
For emails it uses AWS SES and for email queues it uses Redis-Bull.

## Environment Variables Required

- `DEBUG` | set to `false` to disable certain console logs used for debugging. This feature is not fully implemented.</li>
- `NODE_ENV` | `production`, `development`, or `test`/`testing`</li>
- `SITE_DOMAIN_NAME` | the url of the website, like `https://www.website.com`</li>
- `SESSION_SERET`</li>
- `MYSQL_CONNETION_STRING` | as used by Sequelize ORM</li>
- `PORT` | e.g. `3000`</li>
- `TIMEZIME_OFFSET` | offset of the server from Pakistan Standard Time, e.g. `+05:00`</li>
- `AWS_SES_ACCESS_KEY_ID`</li>
- `AWS_SES_SECRET_ACCESS_KEY`</li>
- `AWS_SES_REGION`</li>


## Database Initialization
All models are defined in `/models` using sequelize. In `db/initialize.js`, set `force: true` to create empty database upon server start.

## Modules
To install required dependencies, run `npm install` in the project root.

## Customizations
You may want to change the fontawesome import link. The one currently in use is v5.
