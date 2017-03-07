(function ($) {

 	"use strict";

    $.fn.gulpy = function(options) {

    	var settings = $.extend({
            type: "accordion",
            header: ".title",
            content: ".content"
        }, options);

        if(checkType(settings.type)
        	&& checkHeaderElement(this, settings.header)
        	&& checkContentElement(this, settings.content)) {
    		console.log('ok');
        }

        // return this.css({
        //     color: settings.color,
        //     backgroundColor: settings.backgroundColor
        // });
    };
}(jQuery));

function checkType(type) {

	if(type !== 'accordion' && type !== 'tabs') {
		console.error('Your type is ' + type + ' but it is wrong. \n Make sure your type equals "accordion" or "tabs"');
		return false;
	}

	return true;
}

function checkHeaderElement(elmt, headerElement) {

	var headerExist = $(document).find(elmt).find(headerElement);
	if(headerExist.length <= 0) {
		console.error('It is look like your header element "' + headerElement + '" is missing.\nPlease check your document or your script.');
		return false;
	}

	return true;
}

function checkContentElement(elmt, contentElement) {
	var contentExist = $(document).find(elmt).find(contentElement);

	if(contentExist.length <= 0) {
		console.error('It is look like your content element "' + contentElement + '" is missing.\nPlease check your document or your script.');
		return false;
	}

	return true;
}

function buildAccordion(element) {
	$('.accordion .title').replaceWith('<a href="">' + $('.accordion .title h2').text() + '</a>');

	$('.accordion a').click(function(e) {
		if($(this).siblings('.content:visible').length !== 0) {
			$(this).siblings('.content').slideUp('normal');
		} else {
			$(this).siblings('.content').slideDown('normal');
		}
		e.preventDefault();
	});
}