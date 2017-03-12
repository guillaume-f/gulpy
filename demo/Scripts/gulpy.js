(function ($) {

 	"use strict";

    $.fn.gulpy = function(options) {

    	var settings = $.extend({
            type: "accordion",
            header: ".title",
            content: ".content", 
            animationDuration: 500
        }, options);

        if(checkType(settings.type)
        	&& checkHeaderElement(this, settings.header)
        	&& checkContentElement(this, settings.content)
        	&& checkNumberElements(this, settings.header, settings.content)
        	&& checkTagsAndRelations(this, settings.header, settings.content)
        	&& checkAnimationDuration(settings.animationDuration)) {

	    	switch(settings.type) {
			    case "accordion":
			        buildAccordion(this, settings);
			        break;
			    case "tabs":
			        console.log('tabs');
			        break;
			    default:
			        console.error('An error occured.')
			}
        }
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

function checkNumberElements(elmt, headerElement, contentElement) {
	var headings = $(document).find(elmt).find(headerElement);
	var contents = $(document).find(elmt).find(contentElement);

	if(headings.length !== contents.length) {
		console.error('It is look like the number of titles elements (' + headings.length + ') is different of number of contents elements (' + contents.length + ').\n Please verify your html document');
		return false;
	}

	return true;
}

function checkTagsAndRelations(elmt, headerElement, contentElement) {
	var headings = $(document).find(elmt).find(headerElement);
	var contents = $(document).find(elmt).find(contentElement);
	var result = true;

	$.each(headings, function() {
		var hrefAttribute = '';
		if($(this).prop("tagName").toLowerCase() === 'a') {
			hrefAttribute = $(this).attr('href');
		} else {
			hrefAttribute = $(this).data('href');
		}

		if(!checkHref(elmt, hrefAttribute)) {
			result = false;
		}
	});

	return result;
}
		
function checkHref(elmt, hrefAttribute) {
	var contentExist = $(document).find(elmt).children(hrefAttribute);

	if(contentExist.length === 1) {
		return true;
	} else {
		if(contentExist.length > 1) {
			console.error('It is look like content element "'+ hrefAttribute + '" is present multiple times.')
			return false;
		} else {
			console.error('It is look like title element "'+ hrefAttribute + '" has not the correct content.\n Please check your html document.');
			return false;
		}	
	}
}

function checkAnimationDuration(duration) {

	if(typeof duration === 'number') {
	   	return true;
	} else {
		console.error('It is look like the value of animation duration is not a integer. \n Please insert an integer.');
		return false;
	}
}

function buildAccordion(elmt, settings) {

	var headings = $(document).find(elmt).find(settings.header);
	var link;

	$(document).find(elmt).addClass('gulpy-accordion');
	$.each(headings, function() {
		$(this).addClass('gulpy-accordion-header');
		if($(this).prop("tagName").toLowerCase() === 'a')
			link = $(this).attr('href');
		else link = $(this).data('href');

		$(document).find(elmt).find(link).addClass('gulpy-accordion-content').insertAfter(this);
	});

	accordionReadyToOperate(elmt, settings);
}

function accordionReadyToOperate(elmt, settings) {

	$(document).find(elmt).find(settings.content).hide().addClass('gulpy-accordion-content-close');

	$(document).on('click', settings.header, function(e) {
		if ($(this).next(settings.content).is(':visible')) {
            $(this)
            	.removeClass('gulpy-accordion-header-current')
            	.next(settings.content)
            	.stop()
            	.slideUp(settings.animationDuration)
            	.addClass('gulpy-accordion-content-close')
            	.removeClass('gulpy-accordion-content-open');
        } else {
        	$(document).find(elmt).find(settings.header)
            	.removeClass('gulpy-accordion-header-current');

            $(document).find(elmt).find(settings.content)
            	.stop()
            	.slideUp(settings.animationDuration)
            	.addClass('gulpy-accordion-content-close')
            	.removeClass('gulpy-accordion-content-open');
            $(this)
            	.addClass('gulpy-accordion-header-current')
            	.next(settings.content)
            	.stop()
            	.slideDown(settings.animationDuration)
            	.addClass('gulpy-accordion-content-open')
            	.removeClass('gulpy-accordion-content-close');
            e.preventDefault();
        }
        e.preventDefault();
	});
}