// Scope
// -----

// To avoid global scope pollution, declare all variables and functions inside an
// [immediately-invoked function expression](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) using an augmented [module pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript).

var PDP = (function ( pdp ) {

  'use strict';

  // DOM Interactions
  // ----------------
  // jQuery is used to attach event handlers to DOM elements.

  // Whenever a `select` element is changed, emit an event.

  $('.field select, .field input').on( 'change', function(){

    pdp.observer.emitEvent('filter:changed', $( this ) );

  });

  // Share functionality

  $('a#share').on( 'click', function( ev ){

    var hash = pdp.query.generateUrlHash();

    ev.preventDefault();

    window.location.hash = hash;

  });

  // Hijack the submit button.

  $('form#explore').on( 'submit', function( ev ){

    var url = pdp.query.generateApiUrl();

    ev.preventDefault();

    window.location.replace( url );

  });

  // Open and close filters

  $('.filter .title').on( 'click', function( ev ){

    var id = $( this ).parents('.filter').attr('id'),
        $el = $('#' + id);

    ev.preventDefault();

    if ( $el.hasClass('closed') ) {

      pdp.form.showFilter( $el );

    } else {

      pdp.form.hideFilter( $el );

    } 

  });

  // When the DOM is Ready
  // ----------------

  $(function() {

    pdp.observer.emitEvent('dom:loaded');

  });

  return pdp;

}( PDP || {} ));