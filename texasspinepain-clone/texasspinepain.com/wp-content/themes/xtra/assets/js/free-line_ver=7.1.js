waitCodevz(() => {

	const setupLine = (x) => {
		const row = x.closest('.row');
		if (!row || x.dataset.lineInit) {return;}

		x.dataset.lineInit = '1';

		Codevz.heightChanged(row, () => {
			x.style.height = '1px';
			setTimeout(() => {
				x.style.height = row.offsetHeight + 'px';
			}, 10);
		});
	};

	const initHeaderLines = () => {
		document.querySelectorAll('.header_line_1').forEach(setupLine);

		let mutationTimeout;
		const observer = new MutationObserver(() => {
			clearTimeout(mutationTimeout);
			mutationTimeout = setTimeout(() => {
				document.querySelectorAll('.header_line_1:not([data-line-init])').forEach(setupLine);
			}, 250 );
		});

		const containers = document.querySelectorAll('header, footer, .fixed_side');
		containers.forEach(el => {
			observer.observe(el, { childList: true, subtree: true });
		});
	};

	setTimeout(
		initHeaderLines, 
		document.body.classList.contains('elementor-editor-active') ? 3000 : 1500
	);
});