module.exports = {
  apps : [{
    name   : "iec-lcms",
    script : "server.js",
    args:"-r dotenv/config",
     env: {
	"DEBUG":true,
	"NODE_ENV":"development",
	"SITE_DOMAIN_NAME":"https://apply.iec.org.pk",
	"SESSION_SECRET":"co189ux9wjdio189udnlaidjnc192u8e#91e8ucoasijcdp129cu",
	"MYSQL_CONNECTION_STRING":"mysql://root:yK8@Rpf@Ta@localhost:3306/quizdb",
	"PORT":3000
     }
  }]
}
