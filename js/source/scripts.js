/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function($, Drupal, window, document) {

  // To understand behaviors, see https://drupal.org/node/756722#behaviors
  Drupal.behaviors.eyesbound = {
    attach: function(context, settings) {
      var $cycle = $('.cycle');
      var $cycleImg = $cycle.find('img');
      var $pacman = $('.pacman');
      var $document = $(document);
      var $body = $(document.body);

      $(document).ready(function() {
        // Execute code once the DOM is ready.

        var $mainMenu = $('#block-eyesbound-main-menu');
        $mainMenu.addClass('visible');
        $('<a class="menu-toggle">Menu</a>').on('click', function (e) {
          e.preventDefault();
          $mainMenu.toggleClass('expanded');
        }).appendTo($mainMenu);

        if (screenfull.enabled) {
          $document
            .on(screenfull.raw.fullscreenchange, function () {
              if (screenfull.isFullscreen) {
                $body.addClass('fullscreen');
              } else {
                $body.removeClass('fullscreen');
              }
            })
            .on(screenfull.raw.fullscreenerror, function () {
              if ($body.hasClass('fullscreen-error')) {
                //fullscreen already failed once, lets disable it then.
                $('#toggle-fullscreen').remove();
              } else {
                //hmm fullscreen didn't work for the first time, lets flag body to check if this happens again next time
                $body.addClass('fullscreen-error');
              }
            });
        }

        if (($('body[class*="page-category"]').length || $('body[class*="page-series"]').length) && !$body.hasClass('fullscreen-supported')) {
          if (screenfull.enabled) {
            $body.addClass('fullscreen-supported'); //avoid double binding
            $('<div id="toggle-fullscreen"><i class="icon-resize-full"></i></div>').on('click', function () {
              screenfull.toggle();
            }).appendTo($body);
          }
        }

        if ($('body[class*="page-image"]').length && !$body.hasClass('fullscreen-supported')) {
          if (screenfull.enabled) {
            $body.addClass('fullscreen-supported'); //avoid double binding
            $('<div id="toggle-fullscreen"><i class="icon-resize-full"></i></div>').on('click', function () {
              screenfull.toggle(document.querySelector('.content img'));
            }).appendTo($body);
          }
        }

        $cycle = $('.cycle');
        if ($cycle.length && $cycle.children().length > 1) {
          $cycleImg = $cycle.find('img');

          var title = $cycleImg.eq($cycleImg.length - 1).attr('alt');
            $('<footer id="footer" class="hidden">' +
            '<div class="social-icons">' +
            '<a class="icon-facebook-circled" href="https://www.facebook.com/eyesbound" target="_blank">Facebook</a>' +
            '<a class="icon-gplus-circled" href="https://plus.google.com/+Eyesbound" target="_blank">Google+</a>' +
            '<a class="icon-twitter-circled" href="https://twitter.com/helljannis" target="_blank">Twitter</a>' +
            '<a class="icon-flickr-circled" href="https://www.flickr.com/photos/jannishell/" target="_blank">Flickr</a>' +
            '<a class="icon-tumblr-circled" href="http://jannishell.tumblr.com/" target="_blank">Tumblr</a>' +
            '<a class="icon-linkedin-circled" href="https://www.linkedin.com/in/jannishell" target="_blank">LinkedIn</a>' +
            '</div>' +
            '<h1>' + title + '</h1>' +
            '</footer>').appendTo('#block-eyesbound-content > div');

          $pacman = $('.pacman');

          var addTitle = function() {
            var index = $('#fssList').find('.fssActive').index();
            var newTitle = $cycleImg.eq($cycleImg.length - (index + 1)).attr('alt');
            $('#footer').find('h1').text(newTitle);
          };

          $cycle.fadeSlideShow({
            width: false,
            height: false,
            PlayPauseElement: false,
            NextElementText: '»',
            PrevElementText: '«',
            ListElement: 'fssList',
            addListToId: 'footer',
            afterSlide: addTitle
          });
        }
      });

      $(window).load(function() {
        // Execute code once the window is fully loaded.
        if ($cycle.length) {
          $cycleImg.each(function(index) {
            $(this).parent().css('background-image', 'url(' + this.currentSrc + ')');
            $('#fssList').find('li').eq($cycleImg.length - (index + 1)).find('a').attr('title', this.getAttribute('alt')).html('<img src="' + this.currentSrc + '" />');
          });
          $pacman.hide();
          $cycle.removeClass('hidden');
          $('#footer').removeClass('hidden');
        }
      });

      $(window).resize(function() {
        // Execute code when the window is resized.
        if ($cycle.length) {
          $cycleImg.each(function() {
            $(this).parent().css('background-image', 'url(' + this.currentSrc + ')');
          });
        }
      });

      //$(window).scroll(function() {
        // Execute code when the window scrolls.
      //});
    }
  };

}(jQuery, Drupal, this, this.document));
