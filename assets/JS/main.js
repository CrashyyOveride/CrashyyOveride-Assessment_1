(function($) {
    "use strict";

    const UI = {
        $window: $(window),
        $body: $('body'),
        $nav: $('#nav'),
        $header: $('#header'),
        $navLinks: $('#nav a'),

        init() {
            this.setupBreakpoints();
            this.setupLoadHandler();
            this.setupNavigation();
            this.setupHeader();
        },

        setupBreakpoints() {
            breakpoints({
                wide:     ['961px',  '1880px'],
                normal:   ['961px',  '1620px'],
                narrow:   ['961px',  '1320px'],
                narrower: ['737px',  '960px'],
                mobile:   [null,     '736px']
            });
        },

        setupLoadHandler() {
            this.$window.on('load', () => {
                setTimeout(() => this.$body.removeClass('is-preload'), 100);
            });
        },

        setupNavigation() {
            this.$navLinks.addClass('scrolly');
            $('.scrolly').scrolly();

            this.$navLinks.on('click', function(e) {
                const $this = $(this);
                const href = $this.attr('href');

                if (href.charAt(0) !== '#') return;

                e.preventDefault();
                UI.$navLinks.removeClass('active');
                $this.addClass('active active-locked');
            });

            this.initScrollSpy();
        },

        initScrollSpy() {
            this.$navLinks.each(function() {
                const $link = $(this);
                const $section = $($link.attr('href'));

                if (!$section.length) return;

                $section.scrollex({
                    mode: 'middle',
                    top: '-10vh',
                    bottom: '-10vh',
                    initialize: () => $section.addClass('inactive'),
                    enter: () => {
                        $section.removeClass('inactive');

                        // Update active state if no manual lock is present
                        if (UI.$navLinks.filter('.active-locked').length === 0) {
                            UI.$navLinks.removeClass('active');
                            $link.addClass('active');
                        } else if ($link.hasClass('active-locked')) {
                            $link.removeClass('active-locked');
                        }
                    }
                });
            });
        },

        setupHeader() {
            $('<div id="headerToggle">')
                .append('<a href="#header" class="toggle"></a>')
                .appendTo(this.$body);

            this.$header.panel({
                delay: 500,
                hideOnClick: true,
                hideOnSwipe: true,
                resetScroll: true,
                resetForms: true,
                side: 'left',
                target: this.$body,
                visibleClass: 'header-visible'
            });
        }
    };

    $(() => UI.init());

})(jQuery);
