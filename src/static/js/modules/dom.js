var PDP = (function ( pdp ) {

  'use strict';

  // DOM Interactions
  // ----------------
  // A place for misc. event handlers.

  // Toggle the popular/all filters sections  
  $('a.section-toggle').on( 'click', function( ev ){

    var targetSection = $( this ).attr('href').replace('#', '');

    ev.preventDefault();
    pdp.observer.emitEvent( 'navigation:clicked', [ targetSection ] );

  });

  // Act appropriately when suggested filter sets are changed.
  $('.field.suggested').on( 'change', _.debounce(function( ev ){
    pdp.form.checkPreset();

    if( pdp.form.gottenStarted ){
      pdp.form.handlePreset();
    } else {
      pdp.form.resetFields();
      pdp.form.setFields();
    }

  }, 100));

  $('#get_started_button').on( 'click', _.debounce(function( ev ){
    ev.preventDefault();

    if ( !pdp.form.gottenStarted ){
      pdp.form.handlePreset();
      pdp.form.startedButtonChange();
      pdp.form.gottenStarted = true;
    }

  }, 100));

  // Whenever a field element is changed emit an event.
  $('.filter').on( 'change', '.field select, .field:not(.optional-toggle) input', _.debounce(function(){

    var name,
        value = $('#suggested').val(),
        isSuggestedField = $( this ).parents('.field').hasClass('suggested') || $( this ).parents('.field').hasClass('as_of_year'),
        isCustomAlreadyChosen = value === 'custom';

    pdp.observer.emitEvent('field:changed', [ $( this ).attr('id') ] );

    // Select the 'custom' suggestion if the field they're changing is NOT 
    // the suggestion dropdown and the 'custom' suggestion isn't already chosen.
    if ( !isSuggestedField && !isCustomAlreadyChosen && value ) {
      name = $('.field.suggested select').find('option[value=' + $('.field.suggested select').val() + ']').text();
      name = name ? name + ' (modified)' : 'User modified (see filters below)';
      pdp.form.setCustom( name );
      pdp.form.selectCustom();
    } else if ( isSuggestedField ) {
      pdp.form.removeCustom();
    }

  }, 300 ));

  // When "Raw Data" is clicked, show download module
  $('#view-raw-data-button').on( 'click', function( ev ){
    ev.preventDefault();
    pdp.form.showField('.download-share');
    pdp.form.hideField('#summary');
    pdp.form.hideSections();
    //pdp.form.hideSections();
    //pdp.form.hideField('#summary'); // Do this after you disable the second 'page'
    pdp.app.changeSection.bind( pdp.app );
  });

  $('#summary-table-button').on( 'click', function( ev ){
    //var targetSection = $( this ).attr('href').replace('#', '');

    ev.preventDefault();
    pdp.form.showField('#summary');
    pdp.form.hideField('.download-share');
    pdp.form.hideSections();
    //pdp.observer.emitEvent( 'navigation:clicked', [ targetSection ] );
    //pdp.app.changeSection.bind( pdp.app );
  });

  // Action to show filters to narrow down data - in process, hide the download button.
  $('.show-filters').on( 'click', function( ev ){
    ev.preventDefault();
    if( pdp.form.filtersShown ){
      pdp.form.hideSections();
    } else {
      pdp.form.showSections();
    }
  });

  // Add a new location section whenever the `#add-state` link is clicked.
  $('a#add-state').on( 'click', function( ev ){

    ev.preventDefault();
    pdp.form.locationCount++;
    pdp.form.locationSetNum++;
    pdp.form.addState( pdp.form.locationSetNum );
    if ( pdp.form.locationCount >= pdp.form.maxNumLocations ) {
      $('a#add-state').hide();
    }

  });

  // Co-applicant toggle.
  $('.optional-toggle input').on( 'change', function(){

    var section = $( this ).parents('.optional-toggle').data('optional');

    if ( +$( this ).val() ) {
      pdp.form.toggleOptional( section, 'show' );
    } else {
      pdp.form.toggleOptional( section, 'hide' );
    }

  });

  // Hijack the explore page form submission.
  $('form#explore').on( 'submit', function( ev ){
    var format = $('#format').val(),
        showCodes = !!parseInt( $('.codes input[type=radio]:checked').val(), 10 ),
        url = pdp.query.generateApiUrl( format, showCodes ) + '&$limit=0',     
        isStaticFileAvailable = pdp.form.checkStatic();

    if( isStaticFileAvailable && format === 'csv' ){
      url = isStaticFileAvailable + '.zip';
    }

    console.log( 'This is the URL being passed to app redirect: ', url );

    // Log event to GA
    // track( 'downloads', 'HMDA raw data', 'filter-page:' + url );

    ev.preventDefault();
    pdp.app.redirect( url );

  });

  // Hijack the 'download raw data' button on the summary table page.
  $('#download-raw-button').on( 'click', function( ev ){

    var format = $('#raw-format').val(),
        showCodes = !!parseInt( $('.raw-codes input[type=radio]:checked').val(), 10 ),
        url = pdp.query.generateApiUrl( format, showCodes ) + '&$limit=0',
        isStaticFileAvailable = pdp.form.checkStatic();

    if( isStaticFileAvailable ){
      // If a static file is available, serve it via its URL - hard-coded as a zip for compression
      url = isStaticFileAvailable + '.zip';
    }

    // Log event to GA
    //track( 'downloads', 'HMDA raw data', 'summary-table-page:' + url );
    console.log( 'This is the URL being passed to app redirect: ', url );
    ev.preventDefault();
    pdp.app.redirect( url );

  });

  // Hijack the summary table submission.
  $('#download-summary-button').on( 'click', function( ev ){

    var format = $('#summary-table-format').val(),
        showCodes = true,
        url = pdp.query.generateApiUrl( format, showCodes, pdp.summaryTable.queryParams ) + '&$limit=0';

    ev.preventDefault();
    pdp.app.redirect( url );

  });

  // When the codes/no codes toggle is changed, update the filesize preview.
  $('#download .codes input').on( 'change', function( ev ){

    pdp.query.codes = !!parseInt( $('.codes input[type=radio]:checked').val(), 10 );
    pdp.preview.updateDownloadSize();

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

  // Let user deselect the rate spread radios
  $('input[name=rate_spread]').on( 'click', function( ev ) {
    var $this = $( this );
    if ( $this.hasClass('rate-checked') ) {
      $this.prop( 'checked', false ).trigger('change');
      $('input[name=rate_spread]').removeClass('rate-checked');
    } else {
      $('input[name=rate_spread]').removeClass('rate-checked');
      $this.addClass('rate-checked');
    }
  });

  // Open and close preview section
  $('.preview .title').on( 'click', function( ev ){

    var $container = $('.preview');

    ev.preventDefault();

    if ( !$( this ).hasClass('disabled') ) {

      if ( $container.hasClass('closed') ) {
        pdp.preview.showTable();
      } else {
        pdp.preview.hideTable();
      }

    }

  });

  // When the format is changed, updated `query.format` and the share URL.
  $('#format').on( 'change', function(){
    pdp.query.format = $( this ).val();
  });

  // When a link pointing to the download section is clicked, jump the user there (to the bottom of the page).
  $('a[href=#download]').on( 'click', function( ev ){

    ev.preventDefault();
    $('html, body').animate({ scrollTop: $( document ).height() }, 100);

  });

  // Clear fields and scroll to the top of the filters page.
  $('a.reset').on( 'click', function( ev ){

    ev.preventDefault();

    pdp.form.hideSections();
    $.removeCookie('_hmda');
    pdp.query.reset();
    pdp.form.resetFields(true);
    pdp.form.setFields();
    pdp.form.updateShareLink();
    pdp.preview.update();
    $('.field.suggested select').val('default').trigger('liszt:updated');

  });

  // Set fields to default values and scroll to the top of the filters page.
  $('a.reset-default').on( 'click', function( ev ){

    ev.preventDefault();

    pdp.form.resetFields();
    pdp.query.reset( { defaults: true } );
    pdp.form.setFields();
    pdp.form.updateShareLink();

    var parents = _.map( $('select[data-dependent], input[data-dependent]'), function( el ){
      return $( el ).attr('id');
    });
    pdp.form.checkDeps( parents );

    pdp.preview.update();

  });

  // Prevent non-numeric characters from being typed into specified fields.
  $('.require-numeric').on( 'keydown', pdp.utils.requireNumeric );

  $('.check-range').on( 'change', function( e ){

      var $this = $( this ),
          $min = $this.find('.min-value'),
          $max = $this.find('.max-value');

      if ( $min.val() && $max.val() && parseInt( $min.val(), 10 ) > parseInt( $max.val(), 10 ) ) {
        e.preventDefault();
        $max.tooltip( { title: 'Maximum amount must be greater than or equal to the minimum amount', trigger: 'manual' } );
        $max.tooltip( 'show' );
        $max.val('');
        setTimeout( function(){
          $max.tooltip('destroy');
        }.bind( this ), 5000);
      }
    });

  // When the share URL text box is focused, select all the text inside.
  // `click` is used instead of `focus` due to a [Chrome bug](http://stackoverflow.com/questions/3150275/jquery-input-select-all-on-focus).
  $('.share_url').on( 'click', function(){
    $( this ).select();
  });

  // When the DOM is Ready
  // ----------------
  $(function() {
    pdp.observer.emitEvent('dom:loaded');

    // Load the tabs
      $.fn.cfTabs = function() {

        var tabList = this.find('> ul');
        var tabPanel = this.find('> div');

        //console.log(tabList);

        // Hide all the inactive tab panels. They are not hidden by CSS for 508 compliance
        tabPanel.hide().addClass('cf-tabpanel');
        tabPanel.first().show().addClass('active');

        // Set the first tab to dark green
        tabList.addClass('cf-tablist');
        tabList.find('a').first().addClass('active');
        
        //set the default aria attributes to the tab list
        tabList.attr('role', 'tablist');
        tabList.find('li').attr('role', 'presentation');
        tabList.find('a').attr('role', 'tab').attr('aria-selected', 'false').attr('aria-expanded', 'false').attr('tabindex', '-1');
        tabList.find('a').first().attr('aria-selected', 'true').attr('aria-expanded', 'true').attr('tabindex', '0');

        // add the default aria attributes to the tab panel
        tabPanel.attr('role', 'tabpanel').attr('aria-hidden', 'true').attr('tabindex', '-1');
        tabPanel.first().attr('aria-hidden', 'false').attr('tabindex', '0');

        // create IDs for each anchor for the area-labelledby
        tabList.find('a').each(function() {
          var tabID = $( this ).attr('href').substring(1);

          //console.log(tabID);
          $(this).attr('id','tablist-' + tabID).attr('aria-controls', tabID);
        });

        tabPanel.each(function() {
          //console.log( index + ': ' + $( this ).attr('href').substring(1) );
          var tabID = 'tablist-' + $( this ).attr('id');
          //console.log(tabID);
          $(this).attr('aria-labelledby',tabID);
        });


        // Attach a click handler to all tab anchor elements
        this.find('> ul a').click(function(event) {
          // prevent the anchor link from modifing the url. We don't want the brower scrolling down to the anchor.
          event.preventDefault();
          // The entire tabset, the parent of the clicked tab
          var $thisTabset = $(this).closest('.tabs');

          //console.log('$thisTabset:');
          //console.log($thisTabset);

          var thisTabID = $(this).attr('href');

          //console.log('thisTabID:');
          //console.log(thisTabID);

          //var $thisTabContent = $thisTabset.find(thisTabID);

          //console.log('$thisTabContent:');
          //console.log($thisTabContent);

          // remove all the active classes on the tabs and panels
          $thisTabset.find('.active').removeClass('active');
          // set the aria roles to the default settings for all
          $thisTabset.find('> ul > li > a').attr('aria-selected', 'false').attr('aria-expanded', 'false').attr('tabindex', '-1');
          // hide all the tab panels
          $thisTabset.find('.cf-tabpanel').hide().attr('aria-hidden', 'true').attr('tabindex', '-1');
          
          
          // show the panel
          $(thisTabID).addClass('active').show().attr('aria-hidden', 'false').attr('tabindex', '0');
          //highlight the clicked tab
          $(this).addClass('active').attr('aria-selected', 'true').attr('aria-expanded', 'true').attr('tabindex', '0');
          $(this).focus();
        });

        //set keydown events on tabList item for navigating tabs
        $(tabList).delegate('a', 'keydown',
          function (e) {
            switch (e.which) {
              case 37: case 38:
                if ($(this).parent().prev().length!==0) {
                  $(this).parent().prev().find('>a').click();
                } else {
                  $(tabsList).find('li:last>a').click();
                }
                break;
              case 39: case 40:
                if ($(this).parent().next().length!==0) {
                  $(this).parent().next().find('>a').click();
                } else {
                  $(tabsList).find('li:first>a').click();
                }
                break;
            }
          }
        );


      };
      // END TABS

      // auto-init
      $(function(){
        $('.tabs').cfTabs();
      });
  });

  return pdp;

}( PDP || {} ));
