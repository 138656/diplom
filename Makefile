

TPL_FILES=$(shell find client/ctl -name *.tpl)
XCSS_FILES=$(shell find client/ctl -name *.xcss)
JS_FILES=$(shell find client/ctl/*/ -name *.js)

CLIENT_JS = $(shell find client/src -name *.js)
CLIENT_LIBS = $(shell find client/lib -name *.js)

default: build

start: build
	server/src/index.js

debug: build
	node --debug-brk server/index.js

build: update_styles update_scripts update_images server_templates

server_templates: server/build server/build/templates.js

update_styles: static static/css static/css/ctl.css

update_scripts: static static/js static/js/client.js static/js/ctl.js static/js/ctl_tpl.js static/js/client_lib.js

update_images: static/img

static:
	mkdir static

server/build:
	mkdir server/build

server/build/templates.js: static/js/ctl_tpl.js
	cp -f static/js/ctl_tpl.js server/build/templates.js
	echo "var path = require('path');\nexports.tpl = function(fname, ctx) { return tpl2js(path.join('client', 'ctl', fname), ctx); };\n"  >> server/build/templates.js
	

static/img: static client/img
	cp -fr client/img static

static/css:
	mkdir static/css

static/css/ctl.css: ${XCSS_FILES}
	utils/xcss.js -o static/css/ctl.css client/ctl/style.xcss

static/js:
	mkdir static/js

static/js/client.js: ${CLIENT_JS}
	cat ${CLIENT_JS} > static/js/client.js

static/js/client_lib.js: ${CLIENT_LIBS}
	cat ${CLIENT_LIBS} > static/js/client_lib.js

static/js/ctl.js: ${JS_FILES} client/ctl/ctl.js
	cat client/ctl/ctl.js  > static/js/ctl.js
	cat ${JS_FILES} >> static/js/ctl.js

static/js/ctl_tpl.js: ${TPL_FILES}
	utils/tpl2js.js -o static/js/ctl_tpl.js ${TPL_FILES}

client/lib:
	mkdir client/lib
	curl -o client/lib/underscore.js -X GET "https://github.com/documentcloud/underscore/raw/master/underscore-min.js"
	curl -o client/lib/jquery.js -X GET "https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"
	curl -o client/lib/jquery.history.js -X GET "https://github.com/tkyk/jquery-history-plugin/raw/master/jquery.history.js"
	curl -o client/lib/jquery.log.js -X GET "http://plugins.jquery.com/files/jLog.min.js.txt"


