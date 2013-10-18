;(function($, window, document) {
	
	$(function() {
		
		// The DOM is ready!
		if(typeof(channels) === "undefined" || channels === null) {
			$('#control-bar').addClass('error').text('ERROR: There are no channels defined.');
			
			return false;
		}
		
	});
	
	// Some settings
	var settings = {
				prefix: 'radioshow',
				showImgLink: true,
				buttonPrev: '<i class="icon-circle-arrow-left icon-large"></i>',
				buttonEnd: '<i class="icon-circle-arrow-left icon-large"></i>',
				buttonNext: '<i class="icon-circle-arrow-right icon-large"></i>',
				buttonStart: '<i class="icon-circle-arrow-right icon-large"></i>'
				};
	
	var classnames = settings.prefix;
	
	// Get the control bar container element
	var controlBar = document.querySelector('#control-bar');
	
	// get the showcase container element
	var showcase = document.querySelector('#showcase');
	
	// TEMPLATES
	Templates = {};
	
	// Channel Container
	Templates.channel = [
			'<header>{{intro}}</header>',
			'<article id="{{channel}}" class="{{size}}" data-size="{{rawSize}}">',
				'{{shots}}',
			'</article>'
			].join("\n");
	
	// Channel Shots
	Templates.shot = [
			'<input class="trigger" type="radio" name="{{channel}}-flip" id="{{channel}}-flip-{{shot}}" {{checked}} />',
			'<label class="cue" for="{{channel}}-flip-{{shot}}" data-title="{{headline}}"><span>{{shot}}</span></label>',
			'<div class="shot" style="background-image:url({{imageURL}});">',
				'<div class="text">',
					'<div class="padme">',
						'<label class="prev" for="{{channel}}-flip-{{prevShot}}">{{buttonPrev}}</label>',
						'<label class="next" for="{{channel}}-flip-{{nextShot}}">{{buttonNext}}</label>',
						'<h2><span class="shade hidden">{{shot}}.</span> {{headline}}</h2>',
						'<p>{{desc}}</p>',
						'<p{{showLink}}><small><a href="{{imageURL}}" target="_blank"><i class="icon-search"></i> view image</a></small></p>',
					'</div>',
				'</div>',
			'</div>'
			].join("\n");
	
	// Control Bar for demo settings
	Templates.controlModule = [
			'<ul data-module="{{key}}">',
				'<li class="cat">{{name}}:</li>',
				'{{options}}',
			'</ul>'
			].join("\n");
	
	// Control Bar Options for demo settings
	Templates.controlOption = [
				'<li data-control="{{option}}" {{active}}>{{option}}</li>'
			].join("\n");
	
	// Control Bar data
	var displayControls = [{
								key: 'layout',
								name: "Location",
								options: ["above","below"],
								active: "above"
							},
							{
								key: 'position',
								name: "Position",
								options: ["left","center","right"],
								active: "center"
							},
							{
								key: 'effect',
								name: "FX",
								options: ["none","fade","scale"],
								active: "fade"
							},
							{
								key: 'behavior',
								name: "Caption",
								options: ["slide","dock","hide"],
								active: "dock"
							},
							{
								key: 'movement',
								name: "Slide",
								options: ["over","down","back","up"],
								active: ""
							},
							{
								key: 'placement',
								name: "Dock",
								options: ["west","north","east","south"],
								active: "west"
							}];
	
	// CONTROL BAR Construction
	controlBar.innerHTML = '';
	
	for(var i = 0; i < displayControls.length; i++) {
		
		var options = '';
		classnames += ' ' + settings.prefix + '-' + displayControls[i].active;
		
		for(var o=0; o < displayControls[i].options.length; o++) {
			var option = displayControls[i].options[o];
			var active = displayControls[i].active == option ? ' class="active"' : '';
			
			options += Templates.controlOption
				.replace(/{{option}}/g, option)
				.replace(/{{active}}/g, active);
		}
		
		controlBar.innerHTML += Templates.controlModule
			.replace(/{{key}}/g, displayControls[i].key)
			.replace(/{{name}}/g, displayControls[i].name)
			.replace(/{{options}}/g, options)
			.replace(/{{prefix}}/g, settings.prefix);
	}
	
	// CHANNELS/SHOWCASE Construction
	showcase.innerHTML = '';
	
	for(var c = 0; c < channels.length; c++) {
		var count = channels[c].shots.length;
		var _shots = '';
		var channelName = channels[c].name;
		var channelNameSys = channelName.toLowerCase().replace(/ /g,'-');
		var showLink = channels[c].showImgLink ? '' : ' class="hidden"'
		
		for(var s = 0;s < count; s++) {
			var shot =	s+1;
			var checked = shot == 1 ? ' checked="checked"' : '';
			
			var prevShot = shot == 1 ? count : shot-1;
			var nextShot = shot == count ? 1 : shot+1;
			var buttonPrev = shot == 1 ? settings.buttonEnd : settings.buttonPrev;
			var buttonNext = shot == count ? settings.buttonStart : settings.buttonNext;
			
			
			var imageURL = 'images/'+ channelNameSys + '-' + shot + '.jpg';
			
			_shots += Templates.shot
				.replace(/{{channel}}/g, channelNameSys)
				.replace(/{{shot}}/g, shot)
				.replace(/{{nextShot}}/g, nextShot)
				.replace(/{{prevShot}}/g, prevShot)
				.replace(/{{showLink}}/g, showLink)
				.replace(/{{headline}}/g, channels[c].shots[s].headline)
				.replace(/{{desc}}/g, channels[c].shots[s].desc)
				.replace(/{{imageURL}}/g, imageURL)
				.replace(/{{buttonPrev}}/g, buttonPrev)
				.replace(/{{buttonNext}}/g, buttonNext)
				.replace(/{{checked}}/g, checked);
		}
		
		showcase.innerHTML += Templates.channel
			.replace(/{{channel}}/g, channelNameSys)
			.replace(/{{size}}/g, settings.prefix + '-' + channels[c].size)
			.replace(/{{rawSize}}/g, channels[c].size)
			.replace(/{{shots}}/g, _shots)
			.replace(/{{intro}}/g, '');
	}
	
	
	// jQuery magics
	$('#showcase article').addClass(classnames);
	
	//
	// THIS IS FOR THE CONTROL BAR DEMO
	//
	// hide modules with no active options as they are triggered by other module options
	$('[data-module]').each(function(){
		if($(this).find('li.active').length == 0) {
			$(this).hide();
		}
	});
	
	// do that fiesta food dance
	$('[data-control]').on('click', function(){
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
		
		var control = $(this).data('control');
		
		if(control == 'slide') {
			$('[data-module=placement], [data-module=movement]')
				.find('li')
				.removeClass('active');
			
			$('[data-module=placement]')
				.hide();
			
			$('[data-module=movement]')
				.show()
				.find('li[data-control]')
				.first()
				.addClass('active');
		}
		
		if(control == 'dock') {
			$('[data-module=placement], [data-module=movement]')
				.find('li')
				.removeClass('active');
			
			$('[data-module=placement]')
				.show()
				.find('li[data-control]')
				.first()
				.addClass('active');
			
			$('[data-module=movement]')
				.hide()
				.find('.active')
				.removeClass('active');
		}
		
		if(control == 'hide') {
			$('[data-module=placement], [data-module=movement]')
				.find('li')
				.removeClass('active');
			
			$('[data-module=placement]')
				.hide()
				.find('.active')
				.removeClass('active');
			
			$('[data-module=movement]')
				.hide()
				.find('.active')
				.removeClass('active');
		}
		
		// for demo: restock the classnames
		classnames = settings.prefix;
		
		$('[data-control].active').each(function(){
			classnames += ' ' + settings.prefix + '-' + $(this).data('control');
		});
		
		$('#showcase article').each(function(){
			classnames += ' ' + settings.prefix + '-' + $(this).data('size');
			$(this).removeClass().addClass(classnames);
		});
	});
})(window.jQuery, window, document);