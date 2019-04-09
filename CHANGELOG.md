# Changelog
All notable changes to this project will be documented in this file.
## 0.0.40 - 2018-11-26
- fix mongo url for local tests (non UT)
## 0.0.39 - 2018-11-26
- fix mongo url for local tests (non UT)
## 0.0.38 - 2018-11-25
- fix mongo url bug (which creates a recursive url)
## 0.0.37 - 2018-11-25
- remove logging of the mongo url in the mongo service
## 0.0.36 - 2018-11-25
- add mongo connection close on sigint
## 0.0.35 - 2018-11-22
- fixed mongo url parsing
## 0.0.33 - 2018-10-16
- fix mongo credentials reading
## 0.0.32 - 2018-10-15
- fix mongo credentials reading
## 0.0.31 - 2018-10-15
- exit when services cannot connect to databases
## 0.0.30 - 2018-10-14
- support wait for mongodb
## 0.0.29 - 2018-10-10
- support mongodb user and password secret file
## 0.0.28 - 2018-10-08
- fix to healthcheck
## 0.0.27 - 2018-10-07
- added mongo support
## 0.0.25 - 2018-09-03
- added pubsub support
## 0.0.24 - 2018-08-29
- remove the logstash direct tcp support in the logger service
## 0.0.23 - 2018-08-20
- change mysql service to rely on a pool
## 0.0.22 - 2018-07-30
- add access logging
## 0.0.21 - 2018-07-30
- make services singletones
## 0.0.20 - 2018-07-27
- upgraded esm version
## 0.0.19 - 2018-07-23
- added koa level logger 
## 0.0.18 - 2018-07-22
- added mysql native support, with a single connection capability
## 0.0.17 - 2018-07-16
- change logstash externalize logstash configuration
## 0.0.16 - 2018-07-09
- change logstash endpoint as a part of SD-841
## 0.0.15 - 2018-07-02
- config service refactoring
## 0.0.14 - 2018-07-01
- implemnted healthcheck parent service.
- added healtcheck tests
- added new boolean config parameter for logstash 
## 0.0.13 - 2018-06-27
### added
- introduced a brand new logger (bunyan based) with verified logstash support

## 0.0.12 - 2018-06-25
### changed
- fixes to the configuration: Allowing configuration hierarchy both in the module level as well as child level. Mixin both configuration levels together