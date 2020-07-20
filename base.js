const INDUSTRY_VALUES = {
  'Travel': [100, 101, 100, 106, 105, 101, 86, 46, 20, 19, 14, 17, 17, 18, 24, 27, 28, 30, 37, 40, 44, 47, 48, 44],
  'Financial Investments': [100, 115, 87, 98, 137, 161, 125, 169, 128, 114, 78, 126, 108, 95, 98, 88, 83, 73, 102, 104, 94, 80, 90, 100],
  'Grocery and Wholesale': [100, 108, 108, 103, 111, 123, 143, 150, 109, 118, 117, 122, 127, 129, 133, 125, 126, 121, 123, 118, 121, 116, 132, 115],
  'Apparel and Accessories': [100, 105, 116, 120, 118, 130, 115, 75, 61, 66, 68, 80, 86, 88, 97, 98, 107, 113, 111, 123, 127, 124, 130, 121],
  'Restaurants': [100, 110, 104, 112, 113, 123, 107, 78, 54, 64, 56, 63, 66, 73, 79, 76, 79, 82, 94, 91, 95, 94, 105, 91],
  'Gas Stations': [100, 102, 100, 102, 108, 111, 101, 82, 59, 62, 58, 63, 64, 66, 74, 72, 77, 82, 89, 87, 92, 94, 100, 91],
  'Computers': [100, 112, 111, 114, 125, 132, 120, 132, 126, 133, 134, 168, 179, 163, 167, 158, 163, 154, 153, 151, 162, 141, 123, 121],
  'Personal Care': [100, 115, 110, 111, 110, 130, 111, 76, 36, 38, 30, 33, 35, 39, 48, 50, 64, 66, 87, 86, 91, 96, 115, 93],
  'Beauty': [100, 136, 107, 117, 126, 143, 103, 80, 64, 97, 63, 92, 124, 135, 163, 110, 123, 120, 127, 92, 98, 101, 133, 93],
};

const getWeeklyDateLabels = (startDateString, endDateString) => {
  const currentDate = new Date(startDateString)
  const endDate = endDateString ? new Date(endDateString) : new Date()
  let newDates = []

  while (currentDate < endDate) {
    const month = `${currentDate.getMonth() + 1}`.padStart(2, '0')
    const day = `${currentDate.getDate()}`.padStart(2, '0')
    const year = `${currentDate.getFullYear()}`.slice(2, 4)
    newDates.push(`${month}/${day}/${year}`)
    currentDate.setDate(currentDate.getDate() + 7)
  }

  return newDates
}

const getMonthlyDateLabels = (startDateString, endDateString) => {
  const currentDate = new Date(startDateString)
  const endDate = endDateString ? new Date(endDateString) : new Date()
  let newDates = []

  while (currentDate < endDate) {
    const month = `${currentDate.getMonth() + 1}`.padStart(2, '0')
    const year = `${currentDate.getFullYear()}`.slice(2, 4)
    newDates.push(`${month}/${year}`)
    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return newDates
}

/**
 * Just a helper do determine whether ANY parent (including parents of parents)
 * has a given className. User for dropdowns to detect clicks outside the dropdown.
 */
function hasSomeParentTheClass(element, classname) {
  if (element && $(element).hasClass(classname)) {
    return true;
  }

  return element.parentNode && hasSomeParentTheClass(element.parentNode, classname);
}

/**
 * A helper to add custom styling to the page.
 */
function addStyles (code) {
  const styleNode = document.createElement('style');
  styleNode.innerHTML = code;

  document.head.appendChild(styleNode);
}

/**
 * Main initialization function. Wrapped into anonymous function
 * just not to waste the global namespace.
 */
(function () {
  const CHART_COLORS = [
    '#cf9ac3', '#407578', '#261a3a', '#3AB5BD',
    '#BC46A9', '#5746BC', '#D07736', '#3699D0'
  ];
  const CHART_HEIGHT = 250;

  /**
   * A custom functions that builds the chart - needs to be put somewhere else
   */
  function showChart (selector, config) {
    return $(selector).map(function () {
      /* Initialize chart */
      let chart = null;

      /* Collect chart container information */
      const container = this;
      const width = $(container).width();
      const height = config.height || CHART_HEIGHT;

      /* Cut the wow mom chart component if presented */
      const wowMomChart = container.querySelector('.wow-mom-chart');
      wowMomChart && container.removeChild(wowMomChart);

      /* Clean the container */
      container.innerHTML = '';
      container.style.position = 'relative';

      /* Add a legend to the top of it */
      const legend = document.createElement('DIV');
      legend.style.marginBottom = '28px';
      legend.style.minHeight = config.legend.disableMinHegiht ? 'none' : '86px';

      legend.innerHTML = [
        '<h2 class="heading-small" style="margin-top: 0; margin-bottom: 16px; line-height: 24px; text-align: left">',
          config.legend.heading,
        '</h2>',
        config.legend.labels.length > 1
          ? [
            '<div style="font-family: NeueMontreal; font-size: ' + (config.legend.fontSize || 14 )+ 'px; display: flex; align-items: center; flex-wrap: wrap;">',
            config.legend.labels.map((label, index) =>
              label !== false ? [
                '<div style="vertical-align: middle; white-space: nowrap;">',
                  '<span style="display: inline-block; vertical-align: middle; width: 16px; height: 16px; border-radius: 100%; background: ' + CHART_COLORS[index] + '"></span>',
                  '<span style="vertical-align: middle; margin: 0 16px 0 8px">' + label + '</span>',
                '</div>',
              ].join('') : ''
            ).join(''),
            '</div>',
          ].join('')
          : ''
        ,
      ].join('');

      container.appendChild(legend);

      /**
       * V3 share buttons
       */
      if (config.share) {
        const shareContainer = document.createElement('DIV');
        shareContainer.setAttribute('style', 'position: absolute; top: 10px; right: 10px; display: flex; align-items: center;');


        if (config.share.twitter) {
          shareContainer.innerHTML += [
            '<div class="share-twitter ">',
              '<svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">',
                '<path d="M19.2114 2.47374C18.5054 2.78403 17.7516 2.99543 16.9579 3.09195C17.7667 2.60455 18.3889 1.83638 18.6833 0.919827C17.9247 1.36255 17.0839 1.68482 16.1889 1.8643C15.4742 1.09931 14.4555 0.620697 13.3244 0.620697C11.1571 0.620697 9.39975 2.37802 9.39975 4.54294C9.39975 4.85404 9.43564 5.15318 9.50105 5.43955C6.2385 5.2856 3.34686 3.71893 1.41167 1.35058C1.07105 1.92652 0.880406 2.59579 0.880406 3.32487C0.880406 4.68892 1.5744 5.88785 2.62575 6.59222C1.98202 6.57147 1.37657 6.39439 0.848498 6.10083V6.1495C0.848498 8.05199 2.19899 9.63859 3.99619 9.99994C3.66674 10.0885 3.31895 10.1363 2.96238 10.1363C2.7119 10.1363 2.4718 10.1124 2.23169 10.0677C2.73504 11.6256 4.18204 12.7615 5.90426 12.7934C4.56414 13.8456 2.86585 14.4726 1.03675 14.4726C0.725653 14.4726 0.415351 14.4542 0.103455 14.4192C1.8496 15.5311 3.90684 16.1812 6.1316 16.1812C13.3539 16.1812 17.2984 10.2017 17.2984 5.02476C17.2984 4.85803 17.2984 4.68972 17.2865 4.52221C18.0531 3.9726 18.7223 3.27781 19.2488 2.48969L19.2114 2.47374Z" fill="#261A3A" />',
              '</svg>',
            '</div>',
          ].join('');

          addStyles([
            '.share-twitter { margin-right: 8px; transition: all 100ms ease; cursor: pointer; width: 36px; height: 36px; border-radius: 100%; background: white; display: flex; align-items: center; justify-content: center; }',
            '.share-twitter:hover { transform: scale(1.05); }',
            '.share-twitter:active { transform: scale(.95); }',
          ].join(''));
        }

        if (config.share.linkedin) {
          const secretClass = 'share-linkedin';

          shareContainer.innerHTML += [
            '<div class="' + secretClass + '">',
              '<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">',
                '<path d="M16.2012 15.6187H13.505V11.394C13.505 10.3865 13.4845 9.09008 12.1001 9.09008C10.6943 9.09008 10.4797 10.1863 10.4797 11.3196V15.6187H7.7835V6.93104H10.3734V8.11524H10.4083C10.7702 7.43249 11.6502 6.7118 12.9649 6.7118C15.6967 6.7118 16.2019 8.50973 16.2019 10.8501V15.6187H16.2012ZM4.73839 5.74228C3.87054 5.74228 3.17336 5.0398 3.17336 4.17573C3.17336 3.31242 3.87129 2.6107 4.73839 2.6107C5.60322 2.6107 6.30419 3.31242 6.30419 4.17573C6.30419 5.0398 5.60247 5.74228 4.73839 5.74228ZM6.09026 15.6187H3.38653V6.93104H6.09026V15.6187ZM17.5499 0.103455H2.03315C1.29046 0.103455 0.689636 0.690627 0.689636 1.41511V16.9987C0.689636 17.7239 1.29046 18.3104 2.03315 18.3104H17.5477C18.2896 18.3104 18.8965 17.7239 18.8965 16.9987V1.41511C18.8965 0.690627 18.2896 0.103455 17.5477 0.103455H17.5499Z" fill="#261A3A"/>',
              '</svg>',
            '</div>',
          ].join('');

          addStyles([
            '.' + secretClass + ' { margin-right: 8px; transition: all 100ms ease; cursor: pointer; width: 36px; height: 36px; border-radius: 100%; background: white; display: flex; align-items: center; justify-content: center; }',
            '.' + secretClass + ':hover { transform: scale(1.05); }',
            '.' + secretClass + ':active { transform: scale(.95); }',
          ].join(''));
        }

        container.appendChild(shareContainer);

        $(shareContainer.querySelectorAll('.share-twitter')).on('click', function (e) {
          const url = "https://twitter.com/share?url=" + encodeURIComponent(window.location.href) + "&text=" + encodeURIComponent(document.title);
          const options = 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600';

          window.open(url, '', options);
        });

        $(shareContainer.querySelectorAll('.share-linkedin')).on('click', function (e) {
          const url = 'http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(window.location.href) + "&title=" + encodeURIComponent(document.title); // + summary & title
          const options = 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600';

          window.open(url, '', options);
        });
      }

      /**
       * V3 Custom dropdowns feature
       */
      if (config.selector) {
        /* Create drodowns container */
        const dropdownsContainer = document.createElement('DIV');
        dropdownsContainer.setAttribute('style', 'display: flex; align-items: center; justify-content: flex-start; margin-bottom: 24px;')

        /* Create dropdowns */
        const selectClass = 'select-' + Math.random().toString().split('.')[1];
        dropdownsContainer.innerHTML = [
          /* TODO label feature (e.g. compare at) */
          '',
          /* Actual dropdowns string */
          config.selector.dropdowns.map(({ label, options }, dropdownIndex) => [
            '<div data-hover="" data-delay="0" class="dropdown w-dropdown ' + selectClass + '" role="menu" aria-labelledby="w-dropdown-toggle-0" style="margin-left: 0px;">',
              '<div class="dropdown-toggle w-dropdown-toggle" tabindex="0" id="w-dropdown-toggle-0" aria-controls="w-dropdown-list-0" aria-haspopup="menu" style="outline: none;">',
                '<div class="icon w-icon-dropdown-toggle"></div>',
                '<div class="dropdown-text style="padding-top: 7px">' + label + '</div>',
              '</div>',
              '<nav class="dropdown-list w-dropdown-list" id="w-dropdown-list-0" style="display: block; opacity: 0; pointer-events: none;">',
                options.map((option) => [
                  '<a href="#" class="w-dropdown-link" tabindex="-1" role="menuitem" style="outline: none;" data-value="' + option.value + '" data-index="' + dropdownIndex + '">',
                    option.label,
                  '</a>',
                ].join('')).join(''),
              '</nav>',
            '</div>',
          ].join('')).join(''),
        ].join('');

        container.appendChild(dropdownsContainer);

        /* Add some styling */
        addStyles([
          '.' + selectClass + ' .w-dropdown-link:hover { background: #eee; }',
          '.' + selectClass + ' .w-dropdown-list { position: absolute; top: 0; transition: all 200ms ease; }',
        ]);

        const openDropdown = (node) => {
          $(node.querySelector('.w-dropdown-list')).css('top', '54px');
          $(node.querySelector('.w-dropdown-list')).css('opacity', '1');
          $(node.querySelector('.w-dropdown-list')).css('pointer-events', 'all');
        };

        const closeDropdown = (node) => {
          $(node.querySelector('.w-dropdown-list')).css('top', '0');
          $(node.querySelector('.w-dropdown-list')).css('opacity', '0');
          $(node.querySelector('.w-dropdown-list')).css('pointer-events', 'none');
        };

        let dropdownsValue = config.selector.dropdowns.map((config) => config.default);

        /* Make dropdowns drop down */
        $(container.querySelectorAll('.' + selectClass + ' .w-dropdown-toggle')).on('click', function (e) {
          openDropdown(this.parentNode);
        });

        /* Make options clickable */
        $(container.querySelectorAll('.' + selectClass + ' .w-dropdown-link')).on('click', function (e) {
          closeDropdown(this.parentNode.parentNode);

          const value = this.getAttribute('data-value');
          const index = this.getAttribute('data-index');

          dropdownsValue[index] = value;
          config.selector.onChange(dropdownsValue, chart);

          const label = (config.selector.dropdowns[index].options.filter((option) => option.value === value).pop() || {}).label;
          $(this.parentNode.parentNode.querySelector('.dropdown-text')).text(label);
        });

        $(document.body).on('click', function (e) {
          if (!hasSomeParentTheClass(e.target, 'w-dropdown-toggle')) {
            $('.' + selectClass).each(function () {
              closeDropdown(this);
            });
          }
        });
      }

      /* Create a canvas for chart */
      const canvas = document.createElement('CANVAS');

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = '100%';
      canvas.style.height = height + 'px';
      container.appendChild(canvas);

      /* Append wow mom chart component if presented */
      wowMomChart && container.appendChild(wowMomChart);

      /* TODO V3 bottom labels go here */
      if (config.bottomLabels) {
        const bottomLabelsContainer = document.createElement('DIV');
        bottomLabelsContainer.setAttribute('style', 'margin-top: 12px; display: flex; align-items: center; justify-content: center;');

        config.bottomLabels.forEach((label, index) => {
          bottomLabelsContainer.innerHTML += [
            '<div style="vertical-align: middle; white-space: nowrap;">',
              '<span style="display: inline-block; vertical-align: middle; width: 16px; height: 16px; border-radius: 100%; background: ' + CHART_COLORS[index] + '"></span>',
              '<span style="vertical-align: middle; margin: 0 20px 0 10px">' + label + '</span>',
            '</div>',
          ].join('');
        });

        container.appendChild(bottomLabelsContainer)
      }

      /* Initialize chart */
      chart = new Chart(canvas.getContext('2d'), config);

      return chart;
    });
  };

  /**
   * Just a basic removal function to hide webflow chart placeholders
   */
  function hideChart (selector) {
    $(selector).each(function () {
      this.remove();
    });
  };

  /**
   * Options presets (just one for now)
   */
  function simpleLineOptions () {
    return {
      scales: {
        xAxes: [{
          gridLines: { display: false, drawBorder: false, zeroLineWidth: 0 },
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: (document.body.clientWidth < 768) ? 4 : 10,
            callback: (tick, index) => index === 0 ? '' : tick,
          },
        }],
        yAxes: [{
          gridLines: { lineWidth: 0, drawBorder: false, drawOnChartArea: false, zeroLineWidth: 0 },
          ticks: { autoSkip: true, maxTicksLimit: 8 },
        }],
      },
    };
  };


  /**
   * Paywall stuff
   */
  let __overlayRef = null;
  let __formRef = null;

  function showPaywall () {
    document.body.style.transform = 'none';

    if (__overlayRef === null) {
      const overlay = document.createElement('DIV');
      const form = document.getElementById('report-locked');

      if (!form) return;

      overlay.setAttribute('style', 'position: fixed; height: 100vh; width: 100vw; bottom: 0; z-index: 9999; transition: all 200ms ease; background: rgba(53,53,53,0); opacity: 1;')
      form.setAttribute('style', 'position: absolute; opacity: 0; bottom: -40px; left: 0; width: 100%; height: 65vh; display: block; transition: all 200ms ease;')

      document.body.appendChild(overlay);
      overlay.appendChild(form);

      __overlayRef = overlay;
      __formRef = form;
    }

    __overlayRef.style.display = 'block';
    __overlayRef.style.opacity = '1.0';
    __overlayRef.style.pointerEvents = 'all';

    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      __overlayRef.style.background = 'rgba(53, 53, 53, 0.77)';
      __formRef.style.opacity = '1';
      __formRef.style.bottom = '0px';
    }, 50);
  };

  function hidePaywall () {
    document.body.style.overflow = 'unset';

    __overlayRef.style.opacity = '0.0';
    __overlayRef.style.pointerEvents = 'none';
    __formRef.style.opacity = '0';
    __formRef.style.bottom = '-40px';

    setTimeout(() => {
      __overlayRef.style.display = 'none';
    }, 50);
  };

  /**
   * The main function that checks whether the user has already filled
   * the paywall form and display it if not. If user closes the form /
   * fills it, the callback is called - only parameter is true if user
   * fills the form successfully, if closes by clicking "back" - false
   */
  function displayPaywall (options = {}, hideCallback) {
    /* Do not show the paywal if user comes from email */
    if (new URLSearchParams(window.location.search).get('medium') === 'email') {
      localStorage.setItem('form-submitted', 'true');
      window.history.replaceState(null, null, window.location.pathname);
    }

    /* Do not show the paywall if it was ever submitted */
    if (localStorage.getItem('form-submitted') === 'true') {
      hideCallback && hideCallback(true);
      return
    }

    showPaywall();

    /* Hide the paywall after submit */
    $('#email-form-overlay').on('submit', function () {
      setTimeout(() => {
        if ($('#email-form-overlay .success-message.w-form-done').css('display') === 'block') {
          localStorage.setItem('form-submitted', 'true');
          hidePaywall();
          hideCallback && hideCallback(true);
        }
      }, 2000);
    });

    if (!options.canBack) {
      $('.link-2.w--current').css('display', 'none');
      $('.button---grey.w-button').css('display', 'none');
    }

    /* Back button click in old overlay*/
    $('.link-2.w--current').on('click', (e) => {
      e.preventDefault();
      hidePaywall();
      hideCallback && hideCallback(false);
    });

    /* Back button click in new overlay */
    $('.button---grey.w-button').on('click', (e) => {
      e.preventDefault();
      hidePaywall();
      hideCallback && hideCallback(false);
    });
  };

  /**
   * Custom tooltips (V3 feature)
   */
  const pelotonCustomTooltip = (tooltipConfig) => {
    let tooltipEl = document.getElementById('chartjs-tooltip');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';

      document.body.appendChild(tooltipEl);
    }

    tooltipEl.style.transition = 'all 200ms ease';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.zIndex = '200000';

    return function (tooltipModel) {
      if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
      }

      tooltipEl.classList.remove('above', 'below', 'no-transform');
      tooltipEl.classList.add(tooltipModel.yAlign ? tooltipModel.yAlign : 'no-transform');

      const label = tooltipConfig.label ? tooltipConfig.label(tooltipModel.dataPoints[0]) : '';
      const value = tooltipConfig.value ? tooltipConfig.value(tooltipModel.dataPoints[0]) : '';
      const date = tooltipConfig.date ? tooltipConfig.date(tooltipModel.dataPoints[0]) : tooltipModel.title.slice().shift();

      tooltipEl.innerHTML = [
        '<div style="position: relative; background: #251B39; padding: 20px 12px; border-radius: 4px;">',
          (label || value) ? '<div style="color: white; font-family: NeueMontreal; font-size: 14px;">' + label + ' <strong>' + value + '</strong></div>' : '',
          date ? '<div style="color: white; font-family: NeueMontreal; font-size: 12px; opacity: .54">' + date + '</div>' : '',
          '<div style="bottom: -8px; position: absolute; width: 0; height: 0; border-style: solid; border-width: 8px 8px 0 8px; border-color: #251B39 transparent transparent transparent;"></div>',
        '</div>',
      ].join('');

      const position = this._chart.canvas.getBoundingClientRect();
      const { height } = tooltipEl.getBoundingClientRect();

      tooltipEl.style.opacity = 1;
      tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - 20 + 'px';
      tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - height - 13 + 'px';
    };
  };

  /**
   * Load script handler
   */
  window.$cardifyScripts = {};
  const loadScript = (url) => new Promise((resolve, reject) => {
    const scriptNode = document.createElement('script');

    scriptNode.type = 'text/javascript';
    scriptNode.src = url;

    scriptNode.onerror = reject;
    scriptNode.onload = () => {
      const contentId = scriptNode.getAttribute('data-content-id');
      const content = window.$cardifyScripts[contentId];

      resolve(content);
    };

    document.head.appendChild(scriptNode);
  });

  /**
   * The next code takes all the small graphs and fills
   * them with appropriate data. It should not be actually
   * here, TODO put it to every page separately as a
   * showChartPreview function
   */
  document.addEventListener('DOMContentLoaded', function () {
    const COLORS = {
      'red': '#CE4645',
      'green': '#407578',
    };

    $(function () {
      $('.graph-placeholder').each(function () {
        const container = document.createElement('div');
        container.setAttribute('style', 'height: 100%; width: 100%;');
        this.style.padding = '20px';
        this.appendChild(container);

        const industryName = $(this).attr('data-industry');
        const values = INDUSTRY_VALUES[industryName];

        if (!values) {
          console.error('Industry ', industryName, ' is unknown.');
          return;
        }

        const { width, height } = container.getBoundingClientRect();
        const canvas = document.createElement('CANVAS');
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = '100%';
        canvas.style.height = height + 'px';

        container.appendChild(canvas);

        const positive = (values[values.length - 1] - values[values.length - 2]) > 0;

        new Chart(canvas.getContext('2d'), {
          type: 'line',
          data: {
            labels: (new Array(24)).fill(''),
            datasets: [{
              data: values,
              fill: false,
              borderWidth: 2,
              borderColor: positive ? COLORS.green : COLORS.red,
              pointBackgroundColor: 'rgba(0, 0, 0, 0)',
              pointBorderColor: 'rgba(0, 0, 0, 0)',
              pointHoverBorderColor: 'rgba(0, 0, 0, 0)',
              pointHitRadius: 30,
            }],
          },
          options: {
            legend: { display: false, },
            tooltips: { display: false, enabled: false, },
            scales: {
              xAxes: [{
                gridLines: { display: false, drawBorder: false, zeroLineWidth: 0 },
                ticks: { display: false, },
              }],
              yAxes: [{
                gridLines: { lineWidth: 0, drawBorder: false, drawOnChartArea: false, zeroLineWidth: 0 },
                ticks: { display: false, },
              }],
            },
          },
        });
      });
    });
  });

  window.cardify = {
    showChart, hideChart,
    CHART_COLORS, CHART_HEIGHT,
    simpleLineOptions,
    showPaywall, hidePaywall, displayPaywall,
    tooltips: { pelotonCustomTooltip },
    getWeeklyDateLabels,
    getMonthlyDateLabels,
    loadScript,
  };
})();

/**
 * Work email validation
 */
document.addEventListener('DOMContentLoaded', function () {
  const RULES = {
    'work-email': (input) => {
      const bannedEmailDomains = [
        '@gmail.com', '@hotmail.com', '@outlook.com', '@live.com',
        '.me', '@yahoo.com',
      ];

      const isEmailBanned = bannedEmailDomains.reduce((acc, domain) => acc || $(input).val().endsWith(domain), false);
      input.setCustomValidity(isEmailBanned ? 'Please use your work email address' : '');
    },
  };

  $(document.body).on('input', function (e) {
    const validation = $(e.target).attr('data-cardify-validation');

    if (validation) {
      let validationRules = [];
      try { validationRules = JSON.parse(validation); } catch (e) { console.error('Cannot parse validation rules', this, validation); }

      validationRules.forEach((rule) => {
        if (!RULES[rule]) {
          console.error('The rule has no function', rule);
        } else {
          RULES[rule](e.target);
        }
      });
    }
  });
});

/**
 * MoM & WoW data update
 */
document.addEventListener('DOMContentLoaded', function () {
  // window.cardify.loadScript('https://d2j940tllnytyh.cloudfront.net/cardify/index/data/wow-mom.js')

  const NAME_MAPPING = {
    'Travel': 'travel',
    'Financial Investments': 'financial',
    'Grocery and Wholesale': 'grocery',
    'Apparel and Accessories': 'apparel',
    'Restaurants': 'restaurants',
    'Gas Stations': 'gas',
    'Computers': 'computers',
    'Personal Care': 'care',
    'Beauty': 'beauty',
  }

  let data = {}
  for (const key in INDUSTRY_VALUES) {
    const value = INDUSTRY_VALUES[key]

    const last = value[value.length - 1]
    const prelast = value[value.length - 2]

    const lastsum = value.slice(-4).reduce((acc, i) => acc + i, 0)
    const prelastsum = value.slice(-8, -4).reduce((acc, i) => acc + i, 0)

    data[NAME_MAPPING[key]] = {
      wow: 100 * (last - prelast) / prelast,
      mom: 100 * (lastsum - prelastsum) / prelastsum,
    }
  }

  console.log('Index wow mom data', data);

  $('.wow-mom-change').each(function () {
    const type = $(this).attr('data-type');
    const industry = $(this).attr('data-industry');

    try {
      const value = data[industry][type];

      $(this).text(`${value.toFixed(1)}% ${type === 'wow' ? 'WoW' : 'MoM'} ${value > 0 ? '▲' : '▼'}`);
      $(this).removeClass('wow-mom---small-decline');
      $(this).removeClass('wow-mom---small-incline');
      $(this).addClass(value > 0 ? 'wow-mom---small-incline' : 'wow-mom---small-decline');
    } catch (error) {
      console.error('Cannot fill wow mom for', type, industry, 'becaus of', error);
    }
  });

  $('.wow-mom-card').each(function () {
    const type = $(this).attr('data-type');
    const industry = $(this).attr('data-industry');

    try {
      const value = data[industry][type];

      const arrow = $(this.querySelector('[class^="arrow"]'));
      const text = $(this.querySelector('[class^="wow"]'));

      $(arrow).text(value > 0 ? '↑' : '↓');
      $(arrow).removeClass('arrow-up');
      $(arrow).removeClass('arrow-down');
      $(arrow).addClass(value > 0 ? 'arrow-up' : 'arrow-down');
      $(text).text(`${value.toFixed(1)}% ${type === 'wow' ? 'WoW' : 'MoM'}`);
      $(text).removeClass('wow---incline-text');
      $(text).removeClass('wow---decline-text');
      $(text).addClass(value > 0 ? 'wow---incline-text' : 'wow---decline-text');
    } catch (error) {
      console.error('Cannot fill wow mom for', type, industry, 'becaus of', error);
    }
  });

  /**
   * State Charts data
   */
  const STATE_CHARTS_DATA = [
    {
      "state": "California",
      "industry": "9. Beauty Products",
      "data": "[100, 142, 122, 120, 129, 154, 116, 82, 72, 104, 69, 92, 131, 147, 147, 92, 116, 111, 120]"
    },
    {
      "state": "Florida",
      "industry": "9. Beauty Products",
      "data": "[100, 144, 110, 108, 120, 160, 104, 83, 60, 98, 52, 83, 96, 113, 120, 85, 119, 125, 130]"
    },
    {
      "state": "Illinois",
      "industry": "9. Beauty Products",
      "data": "[100, 132, 96, 107, 127, 141, 100, 77, 69, 108, 59, 93, 115, 129, 143, 82, 118, 113, 99]"
    },
    {
      "state": "New Jersey",
      "industry": "9. Beauty Products",
      "data": "[100, 129, 96, 128, 128, 137, 104, 78, 64, 91, 57, 84, 146, 128, 143, 97, 108, 116, 113]"
    },
    {
      "state": "New York",
      "industry": "9. Beauty Products",
      "data": "[100, 135, 108, 116, 134, 139, 109, 77, 64, 92, 65, 90, 144, 153, 149, 102, 127, 103, 116]"
    },
    {
      "state": "Texas",
      "industry": "9. Beauty Products",
      "data": "[100, 149, 106, 113, 142, 161, 111, 88, 65, 104, 68, 80, 115, 139, 151, 111, 137, 141, 150]"
    }
  ]

  STATE_CHARTS_DATA.forEach(({ state, industry, data }) => {
    $(`.state-chart[data-state="${state}"][data-industry="${industry}"]`).each(function () {
      const node = $(this)

      /* Draw chart */
      const placeholder = node[0].querySelector('.graph-placeholder---large')

      const COLORS = {
        'red': '#CE4645',
        'green': '#407578',
      };

      const container = document.createElement('div');
      container.setAttribute('style', 'height: 100%; width: 100%;');
      // this.style.padding = '20px';
      placeholder.appendChild(container);

      // const industryName = $(this).attr('data-industry');
      let values
      try {
        values = JSON.parse(data)
      } catch (err) {
        console.error(err)
      }

      if (!values) {
        console.error('Industry ', industryName, ' is unknown.');
        return;
      }

      const { width, height } = container.getBoundingClientRect();
      const canvas = document.createElement('CANVAS');
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = '100%';
      canvas.style.height = height + 'px';

      container.appendChild(canvas);

      const positive = (values[values.length - 1] - values[values.length - 2]) > 0;

      new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: (new Array(19)).fill(''),
          datasets: [{
            data: values,
            fill: false,
            borderWidth: 2,
            borderColor: positive ? COLORS.green : COLORS.red,
            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
            pointBorderColor: 'rgba(0, 0, 0, 0)',
            pointHoverBorderColor: 'rgba(0, 0, 0, 0)',
            pointHitRadius: 30,
          }],
        },
        options: {
          legend: { display: false, },
          tooltips: { display: false, enabled: false, },
          scales: {
            xAxes: [{
              gridLines: { display: false, drawBorder: false, zeroLineWidth: 0 },
              ticks: { display: false, },
            }],
            yAxes: [{
              gridLines: { lineWidth: 0, drawBorder: false, drawOnChartArea: false, zeroLineWidth: 0 },
              ticks: { display: false, },
            }],
          },
        },
      });

      const last = values[values.length - 1]
      const prelast = values[values.length - 2]

      const lastsum = values.slice(-4).reduce((acc, i) => acc + i, 0)
      const prelastsum = values.slice(-8, -4).reduce((acc, i) => acc + i, 0)

      const wow = 100 * (last - prelast) / prelast
      const mom = 100 * (lastsum - prelastsum) / prelastsum

      /* Set title */
      $(node[0].querySelectorAll('.paragraph-regular.bold')).text(state)

      /* Set wow moms - skipping for now */
      $(node[0].querySelectorAll('.wow-mom-change')).each(function () {
        const type = $(this).attr('data-type');

        try {
          const value = type === 'wow' ? wow : mom

          $(this).text(`${value.toFixed(1)}% ${type === 'wow' ? 'WoW' : 'MoM'} ${value > 0 ? '▲' : '▼'}`);
          $(this).removeClass('wow-mom---small-decline');
          $(this).removeClass('wow-mom---small-incline');
          $(this).addClass(value > 0 ? 'wow-mom---small-incline' : 'wow-mom---small-decline');
        } catch (error) {
          console.error('Cannot fill wow mom for', type, industry, 'because of', error);
        }
      })
    })
  })
});
