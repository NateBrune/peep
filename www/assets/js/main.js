var cat = "photography"
// Panels.
	var $panels = $('.panel');
	var $body = $('body');

	$panels.each(function() {

		var $this = $(this),
			$toggles = $('[href="#' + $this.attr('id') + '"]'),
			$closer = $('<div class="closer" />').appendTo($this);

		// Closer.
			$closer
				.on('click', function(event) {
					$this.trigger('---hide');
				});

		// Events.
			$this
				.on('click', function(event) {
					event.stopPropagation();
				})
				.on('---toggle', function() {

					if ($this.hasClass('active'))
						$this.triggerHandler('---hide');
					else
						$this.triggerHandler('---show');

				})
				.on('---show', function() {

					// Hide other content.
						if ($body.hasClass('content-active'))
							$panels.trigger('---hide');

					// Activate content, toggles.
						$this.addClass('active');
						$toggles.addClass('active');

					// Activate body.
						$body.addClass('content-active');

				})
				.on('---hide', function() {

					// Deactivate content, toggles.
						$this.removeClass('active');
						$toggles.removeClass('active');

					// Deactivate body.
						$body.removeClass('content-active');

				});

		// Toggles.
			$toggles
				.removeAttr('href')
				.css('cursor', 'pointer')
				.on('click', function(event) {

					event.preventDefault();
					event.stopPropagation();

					$this.trigger('---toggle');

				});

	});

function loaditup(divid){
	(function($) {
		skel.breakpoints({
			xlarge: '(max-width: 1680px)',
			large: '(max-width: 1280px)',
			medium: '(max-width: 980px)',
			small: '(max-width: 736px)',
			xsmall: '(max-width: 480px)'
		});

		$(function() {

			var	$window = $(window),
				$body = $('body'),
				$wrapper = $('#wrapper');

			// Hack: Enable IE workarounds.
				if (skel.vars.IEVersion < 12)
					$body.addClass('ie');

			// Touch?
				if (skel.vars.mobile)
					$body.addClass('touch');

			// Transitions supported?
				if (skel.canUse('transition')) {

					// Add (and later, on load, remove) "loading" class.
						//$body.addClass('loading');

						$window.on('load', function() {
							window.setTimeout(function() {
								$body.removeClass('loading');
							}, 100);
						});

					// Prevent transitions/animations on resize.
						var resizeTimeout;

						$window.on('resize', function() {

							window.clearTimeout(resizeTimeout);

							$body.addClass('resizing');

							resizeTimeout = window.setTimeout(function() {
								$body.removeClass('resizing');
							}, 100);

						});

				}

			// Scroll back to top.
				//$window.scrollTop(0);

			// Fix: Placeholder polyfill.
				$('form').placeholder();

				// Global events.
					$body
						.on('click', function(event) {

							if ($body.hasClass('content-active')) {

								event.preventDefault();
								event.stopPropagation();

								$panels.trigger('---hide');

							}

						});

					$window
						.on('keyup', function(event) {

							if (event.keyCode == 27
							&&	$body.hasClass('content-active')) {

								event.preventDefault();
								event.stopPropagation();

								$panels.trigger('---hide');

							}

						});

			// Header.
				var $header = $('#header');

				// Links.
					$header.find('a').each(function() {

						var $this = $(this),
							href = $this.attr('href');

						// Internal link? Skip.
							if (!href
							||	href.charAt(0) == '#')
								return;

						// Redirect on click.
							$this
								.removeAttr('href')
								.css('cursor', 'pointer')
								.on('click', function(event) {

									event.preventDefault();
									event.stopPropagation();

									window.location.href = href;

								});

					});

			// Footer.
				var $footer = $('#footer');

				// Copyright.
				// This basically just moves the copyright line to the end of the *last* sibling of its current parent
				// when the "medium" breakpoint activates, and moves it back when it deactivates.
					$footer.find('.copyright').each(function() {

						var $this = $(this),
							$parent = $this.parent(),
							$lastParent = $parent.parent().children().last();

						skel
							.on('+medium', function() {
								$this.appendTo($lastParent);
							})
							.on('-medium', function() {
								$this.appendTo($parent);
							});

					});

			// Main.
				var loc = "#".concat(divid)
				var $main = $(loc);

				// Thumbs.
					$main.children('.thumb').each(function() {

						var	$this = $(this),
							$image = $this.find('.image'), $image_img = $image.children('img'),
							x;

						// No image? Bail.
							if ($image.length == 0)
								return;

						// Image.
						// This sets the background of the "image" <span> to the image pointed to by its child
						// <img> (which is then hidden). Gives us way more flexibility.

							// Set background.
								$image.css('background-image', 'url(' + $image_img.attr('src') + ')');

							// Set background position.
								if (x = $image_img.data('position'))
									$image.css('background-position', x);

							// Hide original img.
								$image_img.hide();

						// Hack: IE<11 doesn't support pointer-events, which means clicks to our image never
						// land as they're blocked by the thumbnail's caption overlay gradient. This just forces
						// the click through to the image.
							if (skel.vars.IEVersion < 11)
								$this
									.css('cursor', 'pointer')
									.on('click', function() {
										$image.trigger('click');
									});

					});

				// Poptrox.
					$main.poptrox({
						baseZIndex: 20000,
						caption: function($a) {

							var s = '';

							$a.nextAll().each(function() {
								s += this.outerHTML;
							});

							return s;

						},
						fadeSpeed: 300,
						onPopupClose: function() { $body.removeClass('modal-active'); },
						onPopupOpen: function() { $body.addClass('modal-active'); },
						overlayOpacity: 0,
						popupCloserText: '',
						popupHeight: 150,
						popupLoaderText: '',
						popupSpeed: 300,
						popupWidth: 150,
						selector: '.thumb > a.image',
						usePopupCaption: true,
						usePopupCloser: true,
						usePopupDefaultStyling: false,
						usePopupForceClose: true,
						usePopupLoader: true,
						usePopupNav: true,
						windowMargin: 20
					});

					// Hack: Set margins to 0 when 'xsmall' activates.
						skel
							.on('-xsmall', function() {
								$main[0]._poptrox.windowMargin = 50;
							})
							.on('+xsmall', function() {
								$main[0]._poptrox.windowMargin = 0;
							});

		});

	})(jQuery);
}

function imageExists(url, callback) {
  var img = new Image();
  img.onload = function() { callback(true); };
  img.onerror = function(e) { callback(false); };
  img.src = url;
}

function findUrls( text )
{
    var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]).(?:jpg|gif|png)/ig;

    // Iterate through any URLs in the text.
    while( (matchArray = regexToken.exec( source )) !== null )
    {
        var token = matchArray[0];
        urlArray.push( token );
    }

    return urlArray;
}
var catUsed = false;
var lastauthor = ""
var lastperm = ""
var entries = []
var lastPic = false
var postIndex = 0
var numPosted = 0;
var BreakException = {};
// http://stackoverflow.com/questions/2907482
// Gets Querystring from window.location and converts all keys to lowercase
function getQueryStrings() {
    var assoc = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');

    for (var i in keyValues) {
        var key = keyValues[i].split('=');
        if (key.length > 1) {
            assoc[decode(key[0]).toLowerCase()] = decode(key[1]);
        }
    }

    return assoc;
}

function createQueryString(queryDict) {
    var queryStringBits = [];
    for (var key in queryDict) {
        if (queryDict.hasOwnProperty(key)) {
            queryStringBits.push(key + "=" + queryDict[key]);
        }
    }
    return queryStringBits.length > 0
        ? "?" + queryStringBits.join("&")
        : "";
}
$('#category').on('keydown keypress', function(e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
		cat = $("#category").val()
		var queryString = {"category":cat}
		window.location.href =
		window.location.protocol + "//" +
		window.location.host +
		window.location.pathname +
		createQueryString(queryString);
    e.preventDefault();
    return false;
  }
});

function createElement(url, author){
	var elem = '<article class="thumb"> \
		<a href="'.concat(url).concat('" class="image"><img src="').concat(url).concat('" alt="" /></a>\
		<h2>').concat(author).concat('</h2>\
	</article>')

	return elem
}

function rmDups(arr){
	var uniqueArr = [];
	$.each(arr, function(i, el){
	    if($.inArray(el, uniqueArr) === -1) uniqueArr.push(el);
	});
	return uniqueArr;
}

function populate(catgry){
	lastauthor = ""
	lastperm = ""
	entries = []
	lastPic = false
	postIndex = 0
	numPosted = 0;
	BreakException = {};
	steem.api.getState("/trending/" + catgry, function(err, res){
		var firstauthor = res['content'][Object.keys(res['content'])[0]]['author']
		var firstperm = res['content'][Object.keys(res['content'])[0]]['permlink'] // Get the first post
		steem.api.getDiscussionsByTrending({"limit": 100, "start_author": firstauthor, "start_permlink": firstperm, "tag": cat}, function(err, result){
			try{
				result.forEach(function(perm){
					if(catUsed){
						throw BreakException;
					}
					var author = perm['author']
					var permlink = perm['permlink']
					var url = ""
					try{
						steem.api.getContent(author, permlink, function(error, res){
							try{
								if(findUrls(res['body']).length>0){
									findUrls(res['body']).forEach(function(url){
										if(url!==""){
											imageExists(url, function(bool){
												if(bool){
													postIndex+=1
													entries.push(createElement(url, author))
													//console.log("pushing... ".concat(postIndex).concat(": ").concat(url))
												}
											})
										}
									})
								}
							}
							catch(err) {}
						})
					} catch (err) {
						console.log("Fatal: Failed to get content")
					}
				})
				throw BreakException;
			} catch (e) {
				if(e !== BreakException) throw e;
			}
			return
		})
		return
	})
}

function getMore(){
	numPosted+=10
	var required = 0
	var location = "";
	var mainNumber = Math.ceil(numPosted / 10);
	//console.log("Creating Div: main ".concat(mainNumber))
	location = "main".concat(mainNumber)
	required = mainNumber*10;
	$('#gallery-container').append('<div id="main'.concat(mainNumber).concat('" class="photogall"></div>'));
	var didntload = true
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 100)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 500)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 1000)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 1500)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 2000)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 2500)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 3000)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 3500)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 4000)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 5000)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 6000)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 7000)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 8000)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 9000)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 10000)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 15000)
	setTimeout(function(){if(postIndex>=required && didntload){gogogo(location); didntload=false}}, 20000)
}

var _throttleTimer = null;
var _throttleDelay = 500;
var $window = $(window);
var $document = $(document);

var mc = null;
var popup=null;
function setupHandlers(){
	console.log(mc)
	console.log(popup)
	mc=null;
	popup=null;
	popup = $('.poptrox-popup');
	popup.off("poptrox_close_hijack");
	var close = true;
	popup.on('poptrox_close_hijack', function(ev){
		if(close){
			popup.trigger('poptrox_close');
		} else {
			close=true;
			/*
			if(dir){
				popup.trigger('poptrox_next');
				close=true;
			} else {
				popup.trigger('poptrox_previous');
				close=true;
			}
			*/
		}
	});
	mc = new Hammer(popup[Math.ceil(numPosted / 10)-1]);
	mc.off("press")
	mc.off("panleft")
	mc.off("panright")
	mc.get('press')
	mc.on('press', function(){console.log("press")});
	mc.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 4});
	mc.on("panleft", function(ev){
		console.log("next!")
		close=false;
		dir=1;
		clearTimeout(_throttleTimer);
    _throttleTimer = setTimeout(function () {
			popup.trigger('poptrox_next');
			close=true;
		}, _throttleDelay);
	});
	mc.on("panright", function(ev){
		console.log("previous!")
		close=false;
		dir=0
		clearTimeout(_throttleTimer);
    _throttleTimer = setTimeout(function () {
			popup.trigger('poptrox_previous');
			close=true;
		}, _throttleDelay);
	});
}

function gogogo(location){
	//$("#".concat(location)).hide();
	//console.log("entries length: ".concat(entries.length))
	for (var i = numPosted-10, len = numPosted; i < len; i++) {
		var entry = $(entries[i])
		if(i>10){
			//entry.hide()
			entry.fadeIn(400)
		}
		$('#'.concat(location)).append(entry)
	}
	loaditup(location)
	//$("#".concat(location)).fadeIn(400)
	setTimeout(function(){$('body').removeClass("loading"); setupHandlers()}, 200)
}

$document.ready(function () {

    $window
        .off('scroll', ScrollHandler)
        .on('scroll', ScrollHandler);

});

function ScrollHandler(e) {
    //throttle event:
    clearTimeout(_throttleTimer);
    _throttleTimer = setTimeout(function () {
        //do work
				if ($(window).scrollTop() + $(window).height() + 600 > $(document).height()) {

						getMore();
        }

    }, _throttleDelay);
}

if(getQueryStrings()['category']!=undefined){
	populate(getQueryStrings()['category']);
} else {
	populate('photography');
}
getMore();
