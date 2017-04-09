var initialContentElement;
var initialContentElementDuplicated;
(function ($) {

 	"use strict";
 	var viewportWidth = $(window).width();

    $.fn.gulpy = function(options) {

    	var _this = this;
    	initialContentElement = _this.clone();
    	initialContentElementDuplicated = initialContentElement.clone();

    	var defaultSettings = {
    		type: "accordion",
            header: ".title",
            content: ".content", 
            animationDuration: 500,
            openIndicator: '<span>+</span>',
            closeIndicator: '<span>-</span>',
            responsive: null
    	}

    	var currentSettings = $.extend({}, defaultSettings, options);
    	var initialSettings = currentSettings;
  	
        if(currentSettings.responsive && typeof currentSettings.responsive == 'object' && currentSettings.responsive != null) {

        	var settingsResponsiveCell = checkResponsiveEquality(currentSettings, viewportWidth);
        	var newSettingsResponsiveCell = null;

        	if(settingsResponsiveCell != null) {
        		currentSettings = $.extend({}, defaultSettings, initialSettings.responsive[settingsResponsiveCell].settings);
        	}
        	$(window).resize(function() {
        		_this = initialContentElementDuplicated;
        		if(viewportWidth !== $(window).width()) {
        			viewportWidth = $(window).width();
        			newSettingsResponsiveCell = checkResponsiveEquality(initialSettings, viewportWidth);

        			if(newSettingsResponsiveCell != settingsResponsiveCell) {
        				settingsResponsiveCell = newSettingsResponsiveCell;
        				newSettingsResponsiveCell = null;
        				if(settingsResponsiveCell != null) {
							currentSettings = $.extend({}, defaultSettings, initialSettings.responsive[settingsResponsiveCell].settings);
		        			checkSettingsValues(_this, currentSettings);
        				} else {
			        		currentSettings = initialSettings;
			        		checkSettingsValues(_this, currentSettings);
			        	}
		        	} 
        		}
        	});
	    }

	    checkSettingsValues(_this, currentSettings);
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

	$.each(headings, function(id, value) {
		var hrefAttribute = getTarget($(value));

		if(!checkHref(elmt, hrefAttribute)) {
			result = false;
		}
	});

	return result;
}
		
function checkHref(elmt, hrefAttribute) {
	var contentExist = $(document).find(elmt).find(hrefAttribute);

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

function buildAccordion(elmt, settings) {

	var headings = $(document).find(initialContentElementDuplicated).find(settings.header);

	$(document).find(initialContentElementDuplicated).addClass('gulpy-accordion');
	$.each(headings, function(id, value) {
		var link = getTarget($(value));
		$(value).addClass('gulpy-accordion-header')
		.append('<div class=\'gulpy-accordion-indicator\'>' + settings.openIndicator + '</div>');
		$(document).find(initialContentElementDuplicated).find(link)
			.addClass('gulpy-accordion-content')
			.insertAfter(value);
	});

	accordionReadyToOperate(initialContentElementDuplicated, settings);
}

function accordionReadyToOperate(elmt, settings) {
	$(document).find(elmt).find(settings.content).hide().addClass('gulpy-accordion-content-close');
	var listener = ".gulpy-accordion " + settings.header;

	$(document).on('click', listener, function(e) {
		e.stopImmediatePropagation();
		if ($(e.currentTarget).next(settings.content).is(':visible')) {
            $(e.currentTarget)
            	.removeClass('gulpy-accordion-header-current')
            	.find('.gulpy-accordion-indicator')
            	.empty()
            	.append(settings.openIndicator)
            	.closest(e.currentTarget)
            	.next(settings.content)
            	.stop()
            	.slideUp(settings.animationDuration)
            	.addClass('gulpy-accordion-content-close')
            	.removeClass('gulpy-accordion-content-open');
        } else {
        	$(document).find('.gulpy-accordion').find(settings.header)
            	.removeClass('gulpy-accordion-header-current')
            	.find('.gulpy-accordion-indicator')
            	.empty()
            	.append(settings.openIndicator);

            $(document).find('.gulpy-accordion').find(settings.content)
            	.stop()
            	.slideUp(settings.animationDuration)
            	.addClass('gulpy-accordion-content-close')
            	.removeClass('gulpy-accordion-content-open');

            $(e.currentTarget)
            	.addClass('gulpy-accordion-header-current')
            	.find('.gulpy-accordion-indicator')
            	.empty()
            	.append(settings.closeIndicator)
            	.closest(e.currentTarget)
            	.next(settings.content)
            	.stop()
            	.slideDown(settings.animationDuration)
            	.addClass('gulpy-accordion-content-open')
            	.removeClass('gulpy-accordion-content-close');
        }
        e.preventDefault();
	});
}

function buildTabs(elmt, settings) {
	var headings = $(document).find(initialContentElementDuplicated).find(settings.header);
	var contents = $(document).find(initialContentElementDuplicated).find(settings.content);

	$(document).find(initialContentElementDuplicated)
		.addClass('gulpy-tabs');

	$(document).find(initialContentElementDuplicated)
		.prepend('<div class="gulpy-tabs-headers"></div>');
	$(document).find(initialContentElementDuplicated).find('.gulpy-tabs-headers')
		.append(headings);
	$(document).find(initialContentElementDuplicated).find(settings.header)
		.addClass('gulpy-tabs-header');

	$(document).find(initialContentElementDuplicated)
		.append('<div class="gulpy-tabs-contents"></div>');
	$(document).find(initialContentElementDuplicated).find('.gulpy-tabs-contents')
		.append(contents);
	$(document).find(initialContentElementDuplicated).find(settings.content)
		.addClass('gulpy-tabs-content');

	tabsReadyToOperate(initialContentElementDuplicated, settings);
}

function tabsReadyToOperate(elmt, settings) {
	var currentElement = $(document).find(elmt).find(settings.header).first();
	var link;
	var listener = ".gulpy-tabs " + settings.header;

	$(document).find(elmt).find(settings.content)
		.hide();

	currentElement.addClass('gulpy-tabs-header-current');

	link = getTarget(currentElement);

	$(document).find(elmt).find('.gulpy-tabs-contents').find(link)
		.show()
		.addClass('gulpy-tabs-content-current');

	$(document).on('click', listener, function(e) {
		e.stopImmediatePropagation();
		$(document).find('.gulpy-tabs').find(settings.header)
			.removeClass('gulpy-tabs-header-current');
		$(document).find('.gulpy-tabs').find(settings.content)
			.hide()
			.removeClass('gulpy-tabs-content-current');

		currentElement = $(e.currentTarget);
		link = getTarget(currentElement);

		$(document).find('.gulpy-tabs').find('.gulpy-tabs-contents').find(link)
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

function chooseWhatBuild(elmt, settings) {
	clear(elmt);
	switch(settings.type) {
	    case "accordion":
	        buildAccordion(elmt, settings);
	        break;
	    case "tabs":
	    	buildTabs(elmt, settings);
	        break;
	    default:
	        console.error('An error occured.')
	}
}

function checkResponsiveEquality(settings, viewportWidth) {
	var settingsResponsiveCell = null;

	if(settings.responsive != null) {
		for(var i=0; i<settings.responsive.length; i++) {
			if(viewportWidth <= settings.responsive[i].breakpoint) {
				settingsResponsiveCell = i;
			}
		}
	}

	return settingsResponsiveCell;
}

function checkSettingsValues(elmt, settings) {
    if(checkType(settings.type)
    	&& checkHeaderElement(elmt, settings.header)
    	&& checkContentElement(elmt, settings.content)
    	&& checkNumberElements(elmt, settings.header, settings.content)
    	&& checkTagsAndRelations(elmt, settings.header, settings.content)
    	&& checkAnimationDuration(settings.animationDuration)
    	&& checkIndicators(settings.openIndicator, settings.closeIndicator)) {

    	chooseWhatBuild(elmt, settings);
    }
}

function clear(elmt) {
	initialContentElementDuplicated = initialContentElement.clone();
	$(document).find(elmt).replaceWith(initialContentElementDuplicated);
}