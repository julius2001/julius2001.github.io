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
		var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		document.querySelectorAll('details').forEach(function(details) {

			var summary = details.querySelector('summary');

			if (!summary)
				return;

			summary.addEventListener('click', function(event) {

				// Instant toggle if the user prefers reduced motion.
					if (reduceMotion)
						return;

				event.preventDefault();

				if (details.classList.contains('is-animating'))
					return;

				if (!details.open)
					openDetails(details, summary);
				else
					closeDetails(details, summary);

			});

		});

		function openDetails(details, summary) {

			details.open = true;
			details.classList.add('is-animating');

			var endHeight = details.scrollHeight;

			details.style.height = summary.getBoundingClientRect().height + 'px';

			requestAnimationFrame(function() {
				requestAnimationFrame(function() {
					details.style.transition = 'height 0.35s ease';
					details.style.height = endHeight + 'px';
				});
			});

			details.addEventListener('transitionend', function handler(event) {
				if (event.propertyName !== 'height')
					return;

				details.style.height = '';
				details.style.transition = '';
				details.classList.remove('is-animating');
				details.removeEventListener('transitionend', handler);
			});

		}

		function closeDetails(details, summary) {

			details.classList.add('is-animating');
			details.style.height = details.scrollHeight + 'px';

			requestAnimationFrame(function() {
				requestAnimationFrame(function() {
					details.style.transition = 'height 0.3s ease';
					details.style.height = summary.getBoundingClientRect().height + 'px';
				});
			});

			details.addEventListener('transitionend', function handler(event) {
				if (event.propertyName !== 'height')
					return;

				details.open = false;
				details.style.height = '';
				details.style.transition = '';
				details.classList.remove('is-animating');
				details.removeEventListener('transitionend', handler);
			});

		}

})(jQuery);