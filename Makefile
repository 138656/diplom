

TPL_FILES=$(shell find client/ctl -name *.tpl)
XCSS_FILES=$(shell find client/ctl -name *.xcss)
JS_FILES=$(shell find client/ctl -name *.js)

CLIENT_JS = $(shell find client/src -name *.js)

default: build

start: build
	server/index.js

debug: build
	node --debug-brk server/index.js

build: update_styles update_scripts update_images

update_styles: static static/styles static/styles/ctl.css

update_scripts: static static/scripts static/scripts/client.js static/scripts/ctl.js static/scripts/underscore.js static/scripts/jquery.js static/scripts/jquery.history.js static/scripts/ctl_tpl.js

update_images: static/img

static:
	mkdir static

static/img: static client/img
	cp -fr client/img static

static/styles:
	mkdir static/styles

static/styles/ctl.css: ${XCSS_FILES}
	utils/xcss.js -o static/styles/ctl.css client/ctl/style.xcss

static/scripts:
	mkdir static/scripts

static/scripts/client.js: ${CLIENT_JS}
	cat ${CLIENT_JS} > static/scripts/client.js

static/scripts/ctl.js: ${JS_FILES}
	echo "var \$$ctl = {};" > static/scripts/ctl.js
	cat ${JS_FILES} >> static/scripts/ctl.js

static/scripts/ctl_tpl.js: ${TPL_FILES}
	utils/tpl2js.js -o static/scripts/ctl_tpl.js ${TPL_FILES}

static/scripts/underscore.js:
	curl -o static/scripts/underscore.js -X GET "https://github.com/documentcloud/underscore/raw/master/underscore-min.js"

static/scripts/jquery.js:
	curl -o static/scripts/jquery.js -X GET "https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"

static/scripts/jquery.history.js:
	curl -o static/scripts/jquery.history.js -X GET https://github.com/tkyk/jquery-history-plugin/raw/master/jquery.history.js

