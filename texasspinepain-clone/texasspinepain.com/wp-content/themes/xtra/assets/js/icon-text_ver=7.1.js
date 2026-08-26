waitCodevz(() => {

	const boxes = document.querySelectorAll('header .cz_elm_info_box');
	if (!boxes.length) return;

	const data = Array.from(boxes).map(x => {
		const parent = x.parentElement;
		const grandparent = parent ? parent.parentElement : null;
		const siblingsCount = grandparent ? grandparent.querySelectorAll('.cz_elm_info_box').length : 0;

		return {
			el: x,
			breakpoint: siblingsCount > 1 ? 1024 : 960
		};
	});

	let timeout;
	const handleResize = () => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			const winW = window.innerWidth;
			data.forEach(item => {
				item.el.classList.toggle('xtra-hide-text', winW < item.breakpoint);
			});
		}, 500);
	};

	window.addEventListener( 'resize', handleResize );
	handleResize();

});