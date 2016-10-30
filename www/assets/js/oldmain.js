var catUsed = false
var cat = "photography"
function loaditup(){
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
						$body.addClass('loading');

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
				$window.scrollTop(0);

			// Fix: Placeholder polyfill.
				$('form').placeholder();

			// Panels.
				var $panels = $('.panel');

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
				var $main = $('#main');

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
						windowMargin: 50
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
  img.onerror = function() { callback(false); };
  img.src = url;
}

function findUrls( text )
{
    var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

    // Iterate through any URLs in the text.
    while( (matchArray = regexToken.exec( source )) !== null )
    {
        var token = matchArray[0];
        urlArray.push( token );
    }

    return urlArray;
}
var lastauthor = ""
var lastperm = ""
var entries = []
var lastPic = false
$('#category').on('keydown keypress', function(e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
		catUsed=true
		cat = $("#category").val()
		$("#main").empty()
		populate()
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

function populate(){
	$("#main").empty() // clear the gallery
	setTimeout(function(){$('body').removeClass("loading")}, 10000)
	//#("#main").append("<article><h1>Error.</h1></article>")
	entries = []
	steem.api.getState("/trending/" + cat, function(err, result){
		//console.log(Object.keys(result['content']))
		var index = 0
		Object.keys(result['content']).forEach(function(perm){
			var author = perm.split('/')[0]
			var permlink = perm.split('/')[1]
			var url = ""
			steem.api.getContent(author, permlink, function(error, res){
				index=index+1;
				if(findUrls(res['body']).length>0){
					url=findUrls(res['body'])[0]
					if(url!==""){
						imageExists(url, function(bool){
							if(bool){
								entries.push(createElement(url, author))
							}
							if(index==Object.keys(result['content']).length){
								index = 0
								entries = rmDups(entries)
								console.log("going in for an append!")
								console.log(Object.keys(result).length)
								console.log(index)
								entries.forEach(function(entry){
									$("#main").append(entry)
								})
								loaditup()
								lastauthor=author
								lastperm=permlink
								setTimeout(function(){$('body').removeClass("loading")}, 200)

								if(Object.keys(result).length<12){
									console.log("Appended from 1")
									$("#main").append("<center><br><h2>no more pictures</h2></center>")
									lastPic	= true
								}
							}
						})
					}
				}
			})
		})
		//setTimeout(function(){$('body').removeClass('loading')}, 3000)
	})
}

function getMore(){
	$('body').addClass("loading")
	$("#main").empty() // clear the gallery
	steem.api.getDiscussionsByTrending({"limit": 20, "start_author": lastauthor, "start_permlink": lastperm, "tag": cat}, function(err, result){
		var index = 0
		result.forEach(function(perm){
			var author = perm['author']
			var permlink = perm['permlink']
			var url = ""
			steem.api.getContent(author, permlink, function(error, res){
				index=index+1
				if(findUrls(res['body']).length>0){
					url=findUrls(res['body'])[0]
					if(url!==""){
						imageExists(url, function(bool){
							if(bool){
								entries.push(createElement(url, author))
								console.log("pushing..".concat(index).concat(" out of ").concat(Object.keys(result).length).concat(":").concat(url))
							}
							if(index==Object.keys(result).length){
								index=0
								entries = rmDups(entries)
								entries.forEach(function(entry){
									$("#main").append(entry)
								})
								loaditup()
								lastauthor=author
								lastperm=permlink
								setTimeout(function(){$('body').removeClass("loading")}, 200)
								console.log(Object.keys(result).length)
								if(Object.keys(result).length<20){
									$("#main").append("<div><center><br><h2>no more pictures</h2></center></div>")
									lastPic	= true
								}
							}
						})
					}
				}
			})
		})
	})
}

window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // We're at the bottom of the page...
				//alert("getting more")
				if(!lastPic){
					getMore()
				}
    }
};
populate();
