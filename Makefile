

TPL_FILES=ctl/controls.tpl
XCSS_FILES=ctl/style.xcss
JS_FILES=

default: update_styles update_scripts update_images

update_styles: static static/styles static/styles/ctl.css

update_scripts: static static/scripts static/scripts/underscore.js static/scripts/jquery.js static/scripts/jquery.history.js static/scripts/ctl.js

update_images: static/img

static:
	mkdir static

static/img: static img
	cp -fr img static

static/styles:
	mkdir static/styles

static/styles/ctl.css: ${XCSS_FILES}
	utils/xcss.js -o static/styles/ctl.css ctl/style.xcss

static/scripts:
	mkdir static/scripts

static/scripts/ctl.js: ${TPL_FILES}
	utils/tpl2js.js -o static/scripts/ctl.js ${TPL_FILES}

static/scripts/underscore.js:
	curl -o static/scripts/underscore.js -X GET "https://github.com/documentcloud/underscore/raw/master/underscore-min.js"

static/scripts/jquery.js:
	curl -o static/scripts/jquery.js -X GET "https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"

static/scripts/jquery.history.js:
	curl -o static/scripts/jquery.history.js -X GET https://github.com/tkyk/jquery-history-plugin/raw/master/jquery.history.js

