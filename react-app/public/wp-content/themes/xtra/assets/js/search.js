jQuery( function( $ ) {

	var body 	= $( document.body ),
		overlay = $( '.codevz-plus-dropdown-overlay .inner_layout > .cz_overlay' );

	let typingTimer;

	// Header search custom category selection list.
	body.on( 'click', '.codevz-search-category > strong', function() {

		$( '.codevz-search-category > div' ).slideToggle( 'fast' );

	}).on( 'click', '.codevz-search-category li', function() {

		var $this = $( this ),
			caty = $( '.codevz-search-category' );

		$this.addClass( 'codevz-active' );
		caty.find( 'li' ).not( $this ).removeClass( 'codevz-active' );

		caty.find( '> div' ).slideUp( 'fast' );

		caty.find( '> strong span' ).html( $this.text() );

		caty.find( '> input' ).val( $this.attr( 'data-cat' ) ).trigger( 'change' );

	// Trending search.
	}).on( 'click', '.codevz-search-trending a', function() {

		$( '[name="s"]' ).val( $( this ).text() ).trigger( 'change' ).closest( 'form' ).submit();

	// Header search input AJAX.
	}).on( 'keyup', '.cz_ajax_search [name="s"]', function( e, time ) {

	    var $this 	= $( this ),
	        value   = $this.val(),
	        form    = $this.parent(),
	        results = form.next( '.ajax_search_results' ),
	        icon 	= $( 'button i', form ),
	        org 	= 'fa ' + icon.data('xtra-icon'),
	        iLoader = 'fa fa-superpowers fa-pulse',
	        trending= $( '.codevz-search-trending' );

	    // Prevent duplicate requests for the same input
	    if ( value === $this.data( 'codevz-prev-search' ) ) {
	        return;
	    }

		// Save the last searched value
		$this.data( 'codevz-prev-search', value );

		// Hide results if they are visible before sending new request
		if ( results.is( ':visible' ) ) {
		    results.stop(true, true).slideUp('fast');
		}

		// Check input length before sending request
		if ( value.length < 3 ) {
			overlay.fadeOut();
		    icon.removeClass(iLoader).addClass(org);
			trending.slideDown('fast');
		    return;
		} else {
		    icon.removeClass(org).addClass(iLoader);
		}

		trending.slideUp('fast');

	    // Clear the previous timeout to debounce
	    clearTimeout(typingTimer);

	    // Start a new timeout sending AJAX.
	    typingTimer = setTimeout(function() {

			var tempForm = form.clone();
			tempForm.find('input[type="hidden"]').prop('disabled', false);

	        $.ajax({
	            type: "GET",
	            url: body.data('ajax') || ajaxurl,
	            dataType: 'html',
	            data: "action=codevz_ajax_search&" + tempForm.serialize(),
				success: function(data) {
				    overlay.css( 'z-index', '99' ).fadeIn();
				    trending.slideUp('fast');

				    var $html = $( '<div>' + data + '</div>' );

				    if ( value ) {
				        var regex = new RegExp( '(' + value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + ')', 'gi' );

				        $html.find( 'h3 a' ).each( function() {
				            var title = $( this ).html();
				            $( this ).html( title.replace( regex, '<strong class="ajax_search_results_hightlight">$1</strong>' ) );
				        });
				    }

				    results.html( $html.html() ).stop(true, true).slideDown('fast');
				    icon.removeClass(iLoader).addClass(org);
				},
	            error: function(xhr, status, error) {
					overlay.css( 'z-index', '99' ).fadeIn();
					trending.slideUp('fast');
	                results.html('<b class="ajax_search_error">' + error + '</b>').stop(true, true).slideDown('fast');
	                icon.removeClass(iLoader).addClass(org);
	                console.log(xhr, status, error);
	            }
	        });

	    }, 1500 ); // Wait until user stops typing

	// Search icon
	}).on( 'click', '.search_with_icon', function( e ) {

		e.stopPropagation();

	}).on( 'click', '.search_with_icon [name="s"]', function() {

		if ( $( this ).val() ) {

			overlay.css( 'z-index', '99' ).fadeIn();

			if ( $( '.ajax_search_results .item_small' ).length ) {
				$( '.ajax_search_results' ).slideDown( 'fast' );
			}

		}

	// Search dropdown.
	}).on( 'click', '.search_style_icon_dropdown .xtra-search-icon', function() {

		var x 		= $( this ),
			outer 	= x.parent().find('.outer_search'),
			row 	= x.closest('.row').parent();

		if ( outer.is( ':visible' ) ) {
			row.css( 'z-index', '' );
			outer.fadeOut( 'fast' );
			overlay.fadeOut();
		} else {
			row.css( 'z-index', '99' );
			outer.fadeIn( 'fast' ).find('input').trigger( 'focus' );
			overlay.css( 'z-index', '99' ).fadeIn();
		}

	// Auto x-position search in header.
	}).on( 'click mouseenter', '.search_style_icon_dropdown', function() {

		var x 			= $( this ),
			iconX 		= x.find( '.xtra-search-icon' ),
			iconWidth 	= iconX.outerWidth(),
			dropdown  	= x.find( '.outer_search' );

		if ( ( $( window ).width() / 2 ) > ( x.offset().left + 100 ) ) {

			x.addClass( 'inview_right' );

			var iconMl = parseFloat( iconX.css( 'marginLeft' ) );

			if ( body.hasClass( 'rtl' ) ) {
				dropdown.css( 'left', ( ( iconWidth / 2 ) - 38 + iconMl ) );
			} else {
				dropdown.css( 'left', -( ( iconWidth / 2 ) - 36 + iconMl ) );
			}

		} else {

			dropdown.css( 'right', ( ( iconWidth / 2 ) - 36 + parseFloat( iconX.css( 'marginRight' ) ) ) );

		}

	// Search fullscreen.
	}).on( 'click', '.search_style_icon_full .xtra-search-icon', function( e ) {

		var x = $( this ),
			o = $( '.inner_layout > .cz_overlay' ),
			s = x.parent().find( '.outer_search' );

		o.css( 'z-index', '99' ).fadeIn();
		s.fadeIn( 'fast' ).find( 'input' ).trigger( 'focus' );

		if ( $( '#wpadminbar' ).length ) {
			s.css( 'marginTop', '32px' );
		}

		x.parent().find( '.xtra-close-icon' ).toggleClass( 'hide' ).off().on( 'click', function( e ) {
			$( this ).addClass( 'hide' );
			o.fadeOut();
			s.fadeOut( 'fast' );
		});

	}).on( 'click', '.cz_overlay', function( e ) {

		$( this ).css( 'z-index', '' ).fadeOut();

	}).on( 'click', function( e ) {

		if ( $( e.target ).closest( '.outer_search .search, .sub-menu, .cz_cart_items, .icon_mobile_offcanvas_menu, .xtra-fixed-mobile-nav' ).length ) {
			return;
		}

		overlay.css( 'z-index', '' ).fadeOut();
		body.find( '.page_header > div' ).css( 'z-index', '' );
		body.find( '.ajax_search_results' ).fadeOut( 'fast' );
		body.find( '.search_style_icon_dropdown, .search_style_icon_full' ).find( '.outer_search' ).fadeOut( 'fast' );
		body.find( '.search_style_icon_full' ).find( '.xtra-close-icon' ).addClass( 'hide' );

		$( '.codevz-search-category > div' ).slideUp( 'fast' );

	});

});