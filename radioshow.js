;(function() {
	
	// Some presets
	var prefix = 'radioshow';
	var state = prefix;
	
	// get the control bar element
	var controlBar = document.querySelector('.control-bar');
	
	// get the show container
	var showcase = document.querySelector('#showcase');
	
	// TEMPLATES
	Templates = {};
	
	// Channel Container
	Templates.channel = [
			'<article id="{{channel}}">',
				'{{shots}}',
			'</article>'
			].join("\n");
	
	// Channel Shots
	Templates.shot = [
			'<input class="trigger" type="radio" name="flip" id="flip-{{shot}}" {{checked}} />',
			'<label class="cue" for="flip-{{shot}}" data-title="{{headline}}"><span>{{shot}}</span></label>',
			'<div class="shot" style="background-image:url({{imageURL}});">',
				'<div class="text">',
					'<div class="padme">',
						'<label class="next button" for="flip-{{nextShot}}">{{buttonText}}</label>',
						'<h2><span class="shade">{{shot}}.</span> {{headline}}</h2>',
						'{{desc}}',
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
								options: ["move","dock","hide"],
								active: "dock"
							},
							{
								key: 'movement',
								name: "Move",
								options: ["over","down","back","up"],
								active: ""
							},
							{
								key: 'placement',
								name: "Dock",
								options: ["west","north","east","south"],
								active: "west"
							}];
	
	// Channel data, simulate AJAX result
	var channels = [{
					name: "Example",
					intro: "Hello World",
					shots: [{
								headline: 	"Helvetica",
								desc:		"A pure type face, excellent for building awesome robot shirts.<br><br><a href=\"http://chopshopstore.com/index.php/helbotica.html\" target=\"_blank\">Want one?</a>"
							},
							{
								headline: 	"Coffee Time",
								desc:		"Drinking coffee with a friend is a good thing.<br><br>Invest in human beans."
							},
							{
								headline: 	"Fishermans Are Bad Ass",
								desc:		"&ldquo;My big fish must be somewhere.&rdquo;<br><br>&mdash; Ernest Hemingway, <em>The Old Man and the Sea</em>"
							},
							{
								headline: 	"Flippity-flops!",
								desc:		"Nothin' beats a broked-in pair of flip-flops."
							},
							{
								headline: 	"Everyone Loves A Good Bokeh",
								desc:		"Blur that light source and ramp-up you some saturations!"
							},
							{
								headline: 	"Autumn Spirals And Winter Is Inevitable",
								desc:		"Behind the sweet summer fade, and on a coast not far away... Sometimes we glide, sometimes we fall, and there are times we don't get up at all.<br><br><em>&mdash; The Submarines</em>"
							},
							{
								headline: 	"Everything Has Been Made",
								desc:		"And the walls kept tumbling down in the city that we love. Great clouds roll over the hills, bringing darkness from above.<br><br><em>&mdash; Bastille</em>"
							}]
					}];
	
	// CONTROL BAR Construction
	controlBar.innerHTML = '';
	
	for( var i=0; i < displayControls.length; i++ ) {
		
		var options = '';
		state += ' ' + prefix + '-' + displayControls[i].active;
		
		for(var o=0; o < displayControls[i].options.length; o++) {
			var option = displayControls[i].options[o];
			var active = displayControls[i].active == option ? ' class="active"' : '';
			
			options += Templates.controlOption
				.replace( /{{option}}/g, option)
				.replace( /{{active}}/g, active);
		}
		
		controlBar.innerHTML += Templates.controlModule
			.replace( /{{key}}/g, displayControls[i].key)
			.replace( /{{name}}/g, displayControls[i].name)
			.replace( /{{options}}/g, options)
			.replace( /{{prefix}}/g, prefix);
	}
	
	// CHANNELS/SHOWCASE Construction
	showcase.innerHTML = '';
	
	for(var c = 0;c < channels.length; c++) {
		var count = channels[c].shots.length;
		var _shots = '';
		var channelName = channels[c].name;
		var channelNameSys = channelName.toLowerCase().replace(/ /g,'-');
		
		for(var i = 0;i < count; i++) {
			var buttonText = i == count-1 ? 'Start Over' : 'Next';
			var checked = i == 0 ? ' checked="checked"' : '';
			var shot =	i+1;
			var nextShot = shot == count ? 1 : shot+1;
			var imageURL = 'images/'+ channelNameSys + '-' + shot + '.jpg';
			
			_shots += Templates.shot
				.replace( /{{shot}}/g, shot)
				.replace( /{{nextShot}}/g, nextShot)
				.replace( /{{headline}}/g, channels[c].shots[i].headline)
				.replace( /{{desc}}/g, channels[c].shots[i].desc)
				.replace( /{{imageURL}}/g, imageURL)
				.replace( /{{buttonText}}/g, buttonText)
				.replace( /{{checked}}/g, checked);
		}
		
		showcase.innerHTML += Templates.channel
			.replace( /{{channel}}/g, channelNameSys)
			.replace( /{{shots}}/g, _shots);
	}
	
	
	// jQuery magics
	$('#showcase article').addClass(state);
	
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
		
		if(control == 'move') {
			$('[data-module=placement], [data-module=movement]').find('li').removeClass('active');
			$('[data-module=placement]').hide();
			$('[data-module=movement]').show().find('li[data-control]').first().addClass('active');
		}
		if(control == 'dock') {
			$('[data-module=placement], [data-module=movement]').find('li').removeClass('active');
			$('[data-module=placement]').show().find('li[data-control]').first().addClass('active');
			$('[data-module=movement]').hide().find('.active').removeClass('active');
		}
		if(control == 'hide') {
			$('[data-module=placement], [data-module=movement]').find('li').removeClass('active');
			$('[data-module=placement]').hide().find('.active').removeClass('active');
			$('[data-module=movement]').hide().find('.active').removeClass('active');
		}
		
		state = prefix;
		$('[data-control].active').each(function(){
			state += ' ' + prefix + '-' + $(this).data('control');
		});
		$('#showcase article').removeClass().addClass(state);
	});
})();