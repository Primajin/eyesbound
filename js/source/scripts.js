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

      var addTitle = function() {
        var $thumbnailsList = $('#fssList');
        var index = $thumbnailsList.find('.fssActive').index();
        var $cycle = $('.cycle');
        var $cycleImg = $cycle.find('img');
        var title = $cycleImg.eq($cycleImg.length - (index + 1)).attr('alt');
        $('#footer').find('h1').text(title);
      };

      $(document).ready(function() {
        // Execute code once the DOM is ready.
        $cycle = $('.cycle');
        $cycleImg = $cycle.find('img');

        var title = $cycleImg.eq($cycleImg.length - 1).attr('alt');
        $('<footer id="footer" class="hidden"><h1>' + title + '</h1></footer>').appendTo('#block-eyesbound-content > div');

        $pacman = $('.pacman');

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
      });

      $(window).load(function() {
        // Execute code once the window is fully loaded.
        $cycleImg.each(function() {
          $(this).parent().css('background-image', 'url(' + this.currentSrc + ')');
        });
        $pacman.hide();
        $cycle.removeClass('hidden');
        $('#footer').removeClass('hidden');
      });

      $(window).resize(function() {
        // Execute code when the window is resized.
        $cycleImg.each(function() {
          $(this).parent().css('background-image', 'url(' + this.currentSrc + ')');
        });
      });

      $(window).scroll(function() {
        // Execute code when the window scrolls.
      });
    }
  };

}(jQuery, Drupal, this, this.document));
