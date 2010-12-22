

TPL_FILES=$(shell find client/ctl -name *.tpl)
XCSS_FILES=$(shell find client/ctl -name *.xcss)
JS_FILES=$(shell find client/ctl -name *.js)

CLIENT_JS = $(shell find client/src -name *.js)
SERVER_TPL = $(shell find server/tpl -name *.tpl)

default: build

start: build
	server/src/index.js

debug: build
	node --debug-brk server/index.js

build: update_styles update_scripts update_images server_templates

server_templates: server/build server/build/templates.js server/build/client_templates.js

update_styles: static static/css static/css/ctl.css

update_scripts: static static/js static/js/client.js static/js/ctl.js static/js/underscore.js static/js/jquery.js static/js/jquery.history.js static/js/ctl_tpl.js

update_images: static/img

static:
	mkdir static

server/build:
	mkdir server/build

server/build/client_templates.js: static/js/ctl_tpl.js
	cp -f static/js/ctl_tpl.js server/build/client_templates.js
	echo "exports.tpl = tpl2js;" >> server/build/client_templates.js

server/build/templates.js: ${SERVER_TPL}
	utils/tpl2js.js -o server/build/templates.js ${SERVER_TPL}
	echo "exports.tpl = function(fname, ctx) { return tpl2js(require('path').join('server', 'tpl', fname), ctx); };\n"  >> server/build/templates.js

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

static/js/ctl.js: ${JS_FILES}
	echo "var \$$ctl = {};" > static/js/ctl.js
	cat ${JS_FILES} >> static/js/ctl.js

static/js/ctl_tpl.js: ${TPL_FILES}
	utils/tpl2js.js -o static/js/ctl_tpl.js ${TPL_FILES}

static/js/underscore.js:
	curl -o static/js/underscore.js -X GET "https://github.com/documentcloud/underscore/raw/master/underscore-min.js"

static/js/jquery.js:
	curl -o static/js/jquery.js -X GET "https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"

static/js/jquery.history.js:
	curl -o static/js/jquery.history.js -X GET https://github.com/tkyk/jquery-history-plugin/raw/master/jquery.history.js

