(function ($) {

 	"use strict";
 	var viewportWidth = $(window).width();

    $.fn.gulpy = function(options) {

    	var $this = this;

    	var settings = $.extend({
            type: "accordion",
            header: ".title",
            content: ".content", 
            animationDuration: 500,
            openIndicator: '<span class=\'gulpy-accordion-indicator-open\'>+</span>',
            closeIndicator: '<span class=\'gulpy-accordion-indicator-close\'>-</span>',
            responsive: null
        }, options);

        if(checkType(settings.type)
        	&& checkHeaderElement(this, settings.header)
        	&& checkContentElement(this, settings.content)
        	&& checkNumberElements(this, settings.header, settings.content)
        	&& checkTagsAndRelations(this, settings.header, settings.content)
        	&& checkAnimationDuration(settings.animationDuration)
        	&& checkIndicators(settings.openIndicator, settings.closeIndicator)
        	&& checkResponsive(settings.responsive)) {

	    	switch(settings.type) {
			    case "accordion":
			        buildAccordion(this, settings);
			        break;
			    case "tabs":
			    	buildTabs(this, settings);
			        break;
			    default:
			        console.error('An error occured.')
			}
        }

    	
   //      if(settings.responsive && typeof settings.responsive == 'object' && settings.responsive != null) {
   //      	var settingsResponsiveCell = null;
   //      	for(var i=0; i<settings.responsive.length; i++) {
   //      		if(viewportWidth <= settings.responsive[i].breakpoint) {
   //      			settingsResponsiveCell = i;
   //      		}
   //      	}

	  //       var newSettings = $.extend({
	  //           type: "accordion",
	  //           header: ".title",
	  //           content: ".content", 
	  //           animationDuration: 500,
	  //           event: 'hover',
	  //           openIndicator: '<span class=\'gulpy-accordion-indicator-open\'>+</span>',
	  //           closeIndicator: '<span class=\'gulpy-accordion-indicator-close\'>-</span>',
	  //           responsive: null
	  //       }, settings.responsive[settingsResponsiveCell].settings);

	  //       switch(newSettings.type) {
			//     case "accordion":
			//         buildAccordion(this, settings);
			//         break;
			//     case "tabs":
			//     	buildTabs(this, settings);
			//         break;
			//     default:
			//         console.error('An error occured.')
			// }
	  //   }
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
		var hrefAttribute = getTarget($(this));

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

	if(typeof duration !== 'number') {
	   	console.error('It is look like the value of animation duration is not a integer. \n Please insert an integer.');
		return false;
	}

	return true;
}

function checkIndicators(open, close) {
	if(typeof open !== 'string' || typeof close !== 'string') {
		console.error('Your indicators must be a jQuery selector');
		return false;
	}
	return true;
}

function checkResponsive(responsive) {
	if(typeof responsive != 'object') {
		console.error('Responsive setting murst be an array of objects');
		return false;
	}
	return true;
}

function buildAccordion(elmt, settings) {

	var headings = $(document).find(elmt).find(settings.header);

	$(document).find(elmt).addClass('gulpy-accordion');
	$.each(headings, function() {
		var link = getTarget($(this));
		$(this).addClass('gulpy-accordion-header')
			.append(settings.openIndicator);
		$(document).find(elmt).find(link)
			.addClass('gulpy-accordion-content')
			.insertAfter(this);
	});

	accordionReadyToOperate(elmt, settings);
}

function accordionReadyToOperate(elmt, settings) {

	$(document).find(elmt).find(settings.content).hide().addClass('gulpy-accordion-content-close');

	$(document).on('click', settings.header, function(e) {
		if ($(this).next(settings.content).is(':visible')) {
            $(this)
            	.removeClass('gulpy-accordion-header-current')
            	.append(settings.openIndicator)
            	.next(settings.content)
            	.stop()
            	.slideUp(settings.animationDuration)
            	.addClass('gulpy-accordion-content-close')
            	.removeClass('gulpy-accordion-content-open');
        } else {
        	$(document).find(elmt).find(settings.header)
            	.removeClass('gulpy-accordion-header-current')
            	.append(settings.openIndicator);

            $(document).find(elmt).find(settings.content)
            	.stop()
            	.slideUp(settings.animationDuration)
            	.addClass('gulpy-accordion-content-close')
            	.removeClass('gulpy-accordion-content-open');

            $(this)
            	.addClass('gulpy-accordion-header-current')
            	.append(settings.closeIndicator)
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

function buildTabs(elmt, settings) {
	var headings = $(document).find(elmt).find(settings.header);
	var contents = $(document).find(elmt).find(settings.content);

	$(document).find(elmt)
		.addClass('gulpy-tabs');

	$(document).find(elmt)
		.prepend('<div class="gulpy-tabs-headers"></div>');
	$(document).find(elmt).find('.gulpy-tabs-headers')
		.append(headings);
	$(document).find(elmt).find(settings.header)
		.addClass('gulpy-tabs-header');

	$(document).find(elmt)
		.append('<div class="gulpy-tabs-contents"></div>');
	$(document).find(elmt).find('.gulpy-tabs-contents')
		.append(contents);
	$(document).find(elmt).find(settings.content)
		.addClass('gulpy-tabs-content');

	tabsReadyToOperate(elmt, settings);
}

function tabsReadyToOperate(elmt, settings) {
	var currentElement = $(document).find(elmt).find(settings.header).first();
	var link;

	$(document).find(elmt).find(settings.content)
		.hide();

	currentElement.addClass('gulpy-tabs-header-current');

	link = getTarget(currentElement);

	$(document).find(elmt).find('.gulpy-tabs-contents').find(link)
		.show()
		.addClass('gulpy-tabs-content-current');

	$(document).on('click', settings.header, function(e) {
		$(document).find(elmt).find(settings.header)
			.removeClass('gulpy-tabs-header-current');
		$(document).find(elmt).find(settings.content)
			.hide()
			.removeClass('gulpy-tabs-content-current');

		currentElement = $(this);
		link = getTarget(currentElement);

		$(document).find(elmt).find('.gulpy-tabs-contents').find(link)
			.stop()
			.fadeIn(settings.animationDuration)
			.addClass('gulpy-tabs-content-current');

		currentElement.addClass('gulpy-tabs-header-current');
		e.preventDefault();
	});
}

function getTarget(elmt) {
	if(elmt.prop("tagName").toLowerCase() === 'a')
		return elmt.attr('href');
	else return elmt.data('href');
}