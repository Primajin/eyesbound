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

      $(document).ready(function() {
        // Execute code once the DOM is ready.
        $cycle = $('.cycle');
        if ($cycle.length && $cycle.children().length > 1) {
          $cycleImg = $cycle.find('img');

          var title = $cycleImg.eq($cycleImg.length - 1).attr('alt');
          $('<footer id="footer" class="hidden"><h1>' + title + '</h1></footer>').appendTo('#block-eyesbound-content > div');

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

      $(window).scroll(function() {
        // Execute code when the window scrolls.
      });
    }
  };

}(jQuery, Drupal, this, this.document));
