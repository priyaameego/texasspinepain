! function( $ ) {
	"use strict";

	Codevz_Plus.tabs = function( id, wpb ) {

		wpb && $( '.cz_tabs' ).removeData( 'codevz' );

		$( '.cz_tabs' ).codevzPlus( 'tabs', function( x ) {

			wpb && x.find( '.cz_tabs' ).html( x.find( '.cz_tabs_org' ).html() );

			x.find( '.cz_tab_a' ).each( function() {

				var $this 	= $( this ),
					id 		= 'cz_' + Math.random().toString( 36 ).substr( 2, 9 );

				$this.attr( 'data-tab', id );
				$this.next( 'div' ).attr( 'id', id );

			});

			// Convert tabs nav
			if ( ! x.find( '.cz_tabs_nav' ).length ) {
				x[ x.hasClass( 'cz_tabs_nav_after' ) ? 'append' : 'prepend' ]( '<div class="cz_tabs_nav clr"><div class="clr"></div></div>' );
			}

			x.find( '.cz_tabs_nav > .clr' ).html( '' );

			x.find( '.cz_tab_a' ).each( function() {
				x.find( '.cz_tabs_nav > .clr' ).prepend( $( this ).removeClass( 'vc_empty-element' ).clone() );
			});

			// Remove cloned tab links.
			x.find( '.cz_tabs_content > a.hide' ).remove();

			// onClick tabs nav
			x.find( '.cz_tab_a' ).on( ( x.hasClass( 'cz_tabs_on_hover' ) ? 'mouseenter click' : 'click' ), function() {

				var en  = $( this ),
					id  = en.data( 'tab' ),
					par = en.closest('.cz_tabs'),
					tab = $( '#' + id, par );

				if ( tab.is(':visible') && en.attr( 'href' ) && en.attr( 'href' ).length < 2 ) {
					return false;
				}

				// Set tab active class.
				en.addClass('active cz_active').siblings().removeClass('active cz_active');

				if ( wpb ) {
					$( '.cz_tab', par ).closest( '.vc_cz_tab' ).hide();
					tab.closest( '.vc_cz_tab' ).show();
				} else {
					$( '.cz_tab', par ).hide();
					tab.show();
				}

				setTimeout( function() {

					// Fix Grid.
					if ( tab.find( '.cz_grid' ).data( 'isotope' ) ) {
						tab.find( '.cz_grid' ).isotope( 'layout' );
					}

					// Fix Carousel.
					if ( tab.find( '.slick-initialized' ).length ) {
						tab.find( '.slick-initialized' ).slick( 'refresh' );
					}

					// Fix Working hours line.
					if ( tab.find( '.cz_wh_line_between .cz_wh_line' ).length ) {
						Codevz_Plus.working_hours();
					}

					// Fix Google maps.
					$( window ).trigger( 'scroll.xtra_gmap' );

				}, 100 );

				if ( en.attr( 'href' ) && en.attr( 'href' ).length < 2 ) {
					return false;
				}
			});

			// Active tab.
			x.find( '.cz_tabs_nav a' ).removeClass( 'hide active cz_active' );
			x.find( '.cz_tabs_nav a' + ( id ? '[data-tab="' + id + '"]' : ':first-child' ) ).addClass( 'active cz_active' ).trigger( 'click' );

			// Swip/Touch for long horizontal nav.
		    const slider = document.querySelector( '.cz_tabs:not(.cz_tabs_swiper) .cz_tabs_nav > .clr' );
		    if ( slider ) {
		    	slider.closest( '.cz_tabs' ).classList.add( 'cz_tabs_swiper' );

			    let isDown = false;
			    let isDragging = false;
			    let startX = 0;
			    let lastX = 0;
			    let velX = 0;
			    let momentumID;

			    slider.style.userSelect = "none";
			    slider.addEventListener("dragstart", (e) => e.preventDefault());

			    function momentum() {
			        slider.scrollLeft -= velX;
			        velX *= 0.95;
			        if (Math.abs(velX) > 0.3) {
			            momentumID = requestAnimationFrame(momentum);
			        }
			    }

			    slider.addEventListener("mousedown", (e) => {
			        isDown = true;
			        isDragging = false;
			        startX = lastX = e.pageX;
			        velX = 0;
			        cancelAnimationFrame(momentumID);
			    });

			    slider.addEventListener("mousemove", (e) => {
			        if (!isDown) {return;}

			        const dx = e.pageX - lastX;

			        if (Math.abs(e.pageX - startX) > 5) {
			            isDragging = true;
			        }

			        lastX = e.pageX;
			        slider.scrollLeft -= dx;
			        velX = dx;

			        if (isDragging) {
			            e.preventDefault();
			        }
			    });

			    ["mouseup", "mouseleave"].forEach(ev => {
			        slider.addEventListener(ev, (e) => {
			            if (!isDown) {return;}
			            isDown = false;

			            if (isDragging) {
			                e.preventDefault();
			                momentum();
			            }

			            setTimeout(() => (isDragging = false), 0);
			        });
			    });

			    slider.addEventListener("click", (e) => {
			        if (isDragging) {
			            e.preventDefault();
			            e.stopImmediatePropagation();
			        }
			    }, true);

			    slider.addEventListener("touchstart", () => {}, { passive: true });

			    // Find active tab.
				function scrollToActive( active ) {
				    const sliderRect = slider.getBoundingClientRect();
				    const itemRect   = active.getBoundingClientRect();
				    const isOutLeft  = itemRect.left < sliderRect.left;
				    const isOutRight = itemRect.right > sliderRect.right;

				    if (isOutLeft || isOutRight) {
				        slider.scrollLeft += (itemRect.left - sliderRect.left) - (slider.clientWidth / 2 - active.clientWidth / 2);
				    }
				}
			    slider.addEventListener("click", (e) => {
					const current = e.target.closest('a');
					if ( current ) {
			        	setTimeout( () => scrollToActive( current ), 50 );
					}
			    }, true);

				// Add gradient to nav.
				const isRTL = document.body.classList.contains( 'rtl' );
				function codevzCheckFade() {
				    const max = slider.scrollWidth - slider.clientWidth;
				    const scrollPos = Math.abs(slider.scrollLeft);
				    
				    let showStart, showEnd;

				    if (!isRTL) {
				        showStart = scrollPos > 5 ? 1 : 0;
				        showEnd = scrollPos < max - 5 ? 1 : 0;
				        
				        slider.style.setProperty('--show-left', showStart);
				        slider.style.setProperty('--show-right', showEnd);
				    } else {
				        showStart = scrollPos > 5 ? 1 : 0;
				        showEnd = scrollPos < max - 5 ? 1 : 0;

				        slider.style.setProperty('--show-right', showStart);
				        slider.style.setProperty('--show-left', showEnd);
				    }
				}

				slider.addEventListener("scroll", codevzCheckFade, { passive: true });
				codevzCheckFade();
		    }

		});

	};

	Codevz_Plus.tabs();

}( jQuery );