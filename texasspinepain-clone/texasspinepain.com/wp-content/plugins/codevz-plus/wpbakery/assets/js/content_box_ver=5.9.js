! function( $ ) {
	"use strict";

	Codevz_Plus.content_box = function( wpb ) {

		if ( wpb ) {

			const pdb = parent.document.body;
			const flipBoxes = document.querySelectorAll('.cz_box_backed');

			if (flipBoxes.length && !pdb.querySelector('.cz_vc_disable_flipbox')) {
				const previewItem = pdb.querySelector('.cz_vc_preview');

				if (previewItem) {
					const li = document.createElement('li');
					li.className = 'vc_pull-right cz_vc_disable_flipbox';
					li.innerHTML = '<a href="javascript:;"><i class="fas fa-cube"></i> Disable flip box</a>';

					previewItem.after(li);

					li.addEventListener('click', () => {
						li.classList.toggle('cz_vc_disable_flipbox_disabled');

						document.querySelectorAll('.cz_box_backed, .cz_box_backed_disabled').forEach(box => {
							box.classList.toggle('cz_box_backed');
							box.classList.toggle('cz_box_backed_disabled');
						});
					});
				}
			}

		}

	};

	Codevz_Plus.content_box();

}( jQuery );