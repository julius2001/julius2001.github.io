/*
	Hyperspace by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar'),
		$sidebar_a = $();

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Hack: Enable IE flexbox workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Play initial animations on page load.
		$(document).ready(function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Forms.

		// Hack: Activate non-input submits.
			$('form').on('click', '.submit', function(event) {

				// Stop propagation, default.
					event.stopPropagation();
					event.preventDefault();

				// Submit form.
					$(this).parents('form').submit();

			});

	// Sidebar.
		if ($sidebar.length > 0) {

			$sidebar_a = $sidebar.find("a[href^='#']");

			// iOS Safari quirk: a :hover style on a link makes the first tap
			// fire hover instead of click, so nav links need two taps to
			// activate. The sidebar link :hover is scoped to (hover:hover), and
			// each anchor below also gets a native click handler for reliability.
			$sidebar_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						var href = $this.attr('href');
						if (!href || href.charAt(0) != '#')
							return;

					// Deactivate all links.
						$sidebar_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '-20vh',
							bottom: '-20vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($sidebar_a.filter('.active-locked').length == 0) {

										$sidebar_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		}

	// Scrolly (native): bind a direct click handler instead of the
	// jQuery scrolly plugin. Safari on iPad sometimes fails to dispatch
	// delegated plugin-bound clicks on touch, leaving the nav unresponsive.
	// A native listener with a fragment fallback makes it reliable.
		if ($sidebar_a.length > 0) {
			$sidebar_a.each(function() {
				this.addEventListener('click', function(event) {
					event.preventDefault();
					var href = this.getAttribute('href'),
						target = null;

					try {
						target = document.querySelector(href);
					}
					catch (e) {
						// Invalid selectors use the hash-navigation fallback below.
					}

					if (target) {
						var offset = ($sidebar && $sidebar.length) ? $sidebar.height() : 0;
						var top = target.getBoundingClientRect().top + window.scrollY - offset;
						window.scrollTo({ top: top, behavior: 'smooth' });
					} else {
						window.location.hash = href;
					}
				});
			});
		}

	// Spotlights.
		$('.spotlights > section')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			});

	// Features.
		$('.features')
			.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			});

	// Banners.
		$('.banner-image')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					// Deactivate banner.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate banner.
						$(this).removeClass('inactive');

				}
			});

	// Smooth expand/collapse for <details> (repertoire, dates).
	//
	// The height animation itself lives in CSS (a grid-template-rows
	// transition on .details-content), which the browser can interpolate
	// smoothly on its own — opening "just works" as soon as the native
	// [open] attribute lands. Closing is the one thing CSS can't do alone:
	// <details> normally hides its content instantly, so this keeps [open]
	// set for one extra frame while the CSS transition plays, then
	// actually closes it once that transition has finished.
		document.querySelectorAll('details').forEach(function(details) {

			var summary = details.querySelector('summary'),
				content = details.querySelector('.details-content');

			if (!summary || !content)
				return;

			summary.addEventListener('click', function(event) {

				// Only closing needs special handling.
					if (!details.open)
						return;

				event.preventDefault();

				if (details.classList.contains('is-closing'))
					return;

				details.classList.add('is-closing');

				content.addEventListener('transitionend', function handler(e) {
					if (e.propertyName !== 'grid-template-rows')
						return;

					content.removeEventListener('transitionend', handler);
					details.classList.remove('is-closing');
					details.open = false;
				});

			});

		});

})(jQuery);