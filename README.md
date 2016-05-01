=====================
Introduction to Eyesbound
=====================

Eyesbound boasts a clean HTML5 structure with extensible CSS classes and IDs for
unlimited theming possibilities as well as a top-down load order for improved
SEO. It is fully responsive out-of-the-box and provides an adaptive, elegant,
SASS-based grid system (Bourbon Neat).

Eyesbound is based on Basic (https://www.drupal.org/project/basic).

Less code spam, more ham.


============
Installation
============

Eyesbound utilizes SASS for adaptive grids and layouts and general structure of the
site. It's recommended to use SASS for building out your theme. The following
packages are included via 'npm install'
  - SASS (http://sass-lang.com/)
  - Bourbon (http://bourbon.io/)
  - Bourbon Neat (http://neat.bourbon.io/)

============================
How to compile SASS in Eyesbound
============================

To use SASS and automatically compile it within your theme, please refer to "How
to Use Grunt with Eyesbound" in the documentation below.

Install node-sass:

  npm install node-sass -g

If you don't like Grunt, or would just prefer to use SASS' internal watch
functionality, simply cd into your theme directory and run:

  node-sass sass -o css --output-style expanded --source-map true --watch

Or simply compile the latest:

  node-sass sass -o css --output-style expanded --source-map true


=======================
What are the files for?
=======================

- eyesbound.info.yml
  Provide informations about the theme, like regions and libraries.
- block.html.twig
  Template to edit the blocks.
- comment.html.twig
  Template to edit the comments.
- node.html.twig
  Template to edit the nodes (in content).
- page.html.twig
  Template to edit the page.
- eyesbound.theme
  Used to modify Drupal's default behavior before outputting HTML through the
  templates.
- theme-settings.php
  Provides additional settings in the theme settings page.


============
In /sass
============

- layout/layout.sass
  Defines the layout of the theme (compiles to css/layout/layout.css)
- theme/print.sass
  Defines the way the theme looks when printed (compiles to css/theme/print.css)
- components/tabs.sass
  Styles for the admin tabs (compiles to css/components/tabs.css)


============
In /js
============

- modernizr.js
  Modernizr detects HTML and CSS features and applies classes to
  the <html> object you can then reference in your stylesheets. Use the URL at
  the top of the modernizr.js file to customize the features you wish to detect.
- selectivizr-min.js
  This script will only be loaded for Internet Explorer 8
  through the ie8 theme library. It will provide a JS fallback for CSS :nth-
  child, an important part of the Bourbon Neat grid system, as it is not
  supported in Internet Explorer 8.
- build/scripts.js & source/scripts.js
  When using Grunt, save files to the
  source folder and a minified version will automatically be saved to the build
  folder. See comments in eyesbound.libraries.yml file to enable the starter
  scripts.js file.


===================
Changing the Layout
===================

The layout used in Eyesbound is fairly similar to the Holy Grail method. It has been
tested on all major browsers including IE (5 to >10), Opera, Firefox, Safari,
and Chrome. The purpose of this method is to have a minimal markup for an ideal
display. For accessibility and search engine optimization, the best order to
display a page is the following:

1. Header
2. Content
3. Sidebars
4. Footer

This is how the page template is buit in Eyesbound, and it works in fluid and fixed
layout. Refer to the notes in layout.sass to see how to modify the layout.


===========================
How to Use Grunt with Eyesbound
===========================

Grunt (http://gruntjs.com/) requires Node.JS to be installed on your machine.
There are various package managers that can handle this for you.

https://nodejs.org/download/

Once Node.JS is installed, go to the root folder of Eyesbound and install your Grunt
packages:

  npm install

This will install the neccessary node_modules to run Grunt. In order for Grunt
to work from the command line we are going to need the Grunt CLI. Open a new
Terminal window and type:

  npm install -g grunt-cli

This will install the CLI globally. Restart terminal when that is complete and
you will now be able to use Grunt commands.

Once installed, cd to the root folder of Eyesbound and run Grunt via the command
line:

  grunt

This will initialize Grunt and start watching changes to your SASS files. Voilà!


================
Bugs & Questions
================

Thanks for using Eyesbound, and remember to use the issue queue in drupal.org for
any questions or bug reports:

https://github.com/Primajin/eyesbound/issues


====================
Current maintainers:
====================
* Jannis Lennart Hell (Primajin)              - https://github.com/Primajin
