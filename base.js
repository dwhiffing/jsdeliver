;(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) : factory()
})(function () {
  'use strict'

  const INDUSTRY_VALUES = {
    Travel: [
      100,
      101,
      100,
      106,
      105,
      101,
      86,
      46,
      20,
      19,
      14,
      17,
      17,
      18,
      24,
      27,
      28,
      30,
      37,
      40,
      44,
      47,
      48,
      44,
    ],
    'Financial Investments': [
      100,
      115,
      87,
      98,
      137,
      161,
      125,
      169,
      128,
      114,
      78,
      126,
      108,
      95,
      98,
      88,
      83,
      73,
      102,
      104,
      94,
      80,
      90,
      100,
    ],
    'Grocery and Wholesale': [
      100,
      108,
      108,
      103,
      111,
      123,
      143,
      150,
      109,
      118,
      117,
      122,
      127,
      129,
      133,
      125,
      126,
      121,
      123,
      118,
      121,
      116,
      132,
      115,
    ],
    'Apparel and Accessories': [
      100,
      105,
      116,
      120,
      118,
      130,
      115,
      75,
      61,
      66,
      68,
      80,
      86,
      88,
      97,
      98,
      107,
      113,
      111,
      123,
      127,
      124,
      130,
      121,
    ],
    Restaurants: [
      100,
      110,
      104,
      112,
      113,
      123,
      107,
      78,
      54,
      64,
      56,
      63,
      66,
      73,
      79,
      76,
      79,
      82,
      94,
      91,
      95,
      94,
      105,
      91,
    ],
    'Gas Stations': [
      100,
      102,
      100,
      102,
      108,
      111,
      101,
      82,
      59,
      62,
      58,
      63,
      64,
      66,
      74,
      72,
      77,
      82,
      89,
      87,
      92,
      94,
      100,
      91,
    ],
    Computers: [
      100,
      112,
      111,
      114,
      125,
      132,
      120,
      132,
      126,
      133,
      134,
      168,
      179,
      163,
      167,
      158,
      163,
      154,
      153,
      151,
      162,
      141,
      123,
      121,
    ],
    'Personal Care': [
      100,
      115,
      110,
      111,
      110,
      130,
      111,
      76,
      36,
      38,
      30,
      33,
      35,
      39,
      48,
      50,
      64,
      66,
      87,
      86,
      91,
      96,
      115,
      93,
    ],
    Beauty: [
      100,
      136,
      107,
      117,
      126,
      143,
      103,
      80,
      64,
      97,
      63,
      92,
      124,
      135,
      163,
      110,
      123,
      120,
      127,
      92,
      98,
      101,
      133,
      93,
    ],
  }

  const CHART_HEIGHT = 250

  const CHART_COLORS = [
    '#cf9ac3',
    '#407578',
    '#261a3a',
    '#3AB5BD',
    '#BC46A9',
    '#5746BC',
    '#D07736',
    '#3699D0',
  ]

  function hasSomeParentTheClass(element, classname) {
    if (element && $(element).hasClass(classname)) {
      return true
    }

    return (
      element.parentNode && hasSomeParentTheClass(element.parentNode, classname)
    )
  }

  function addStyles(code) {
    const styleNode = document.createElement('style')
    styleNode.innerHTML = code

    document.head.appendChild(styleNode)
  }

  function simpleLineOptions() {
    return {
      scales: {
        xAxes: [
          {
            gridLines: { display: false, drawBorder: false, zeroLineWidth: 0 },
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: document.body.clientWidth < 768 ? 4 : 10,
              callback: (tick, index) => (index === 0 ? '' : tick),
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              lineWidth: 0,
              drawBorder: false,
              drawOnChartArea: false,
              zeroLineWidth: 0,
            },
            ticks: { autoSkip: true, maxTicksLimit: 8 },
          },
        ],
      },
    }
  }

  function showChart(selector, config) {
    return $(selector).map(function () {
      /* Initialize chart */
      let chart = null

      /* Collect chart container information */
      const container = this
      const width = $(container).width()
      const height = config.height || CHART_HEIGHT

      /* Cut the wow mom chart component if presented */
      const wowMomChart = container.querySelector('.wow-mom-chart')
      wowMomChart && container.removeChild(wowMomChart)

      /* Clean the container */
      container.innerHTML = ''
      container.style.position = 'relative'

      /* Add a legend to the top of it */
      const legend = document.createElement('DIV')
      legend.style.marginBottom = '28px'
      legend.style.minHeight = config.legend.disableMinHegiht ? 'none' : '86px'

      legend.innerHTML = [
        '<h2 class="heading-small" style="margin-top: 0; margin-bottom: 16px; line-height: 24px; text-align: left">',
        config.legend.heading,
        '</h2>',
        config.legend.labels.length > 1
          ? [
              '<div style="font-family: NeueMontreal; font-size: ' +
                (config.legend.fontSize || 14) +
                'px; display: flex; align-items: center; flex-wrap: wrap;">',
              config.legend.labels
                .map((label, index) =>
                  label !== false
                    ? [
                        '<div style="vertical-align: middle; white-space: nowrap;">',
                        '<span style="display: inline-block; vertical-align: middle; width: 16px; height: 16px; border-radius: 100%; background: ' +
                          CHART_COLORS[index] +
                          '"></span>',
                        '<span style="vertical-align: middle; margin: 0 16px 0 8px">' +
                          label +
                          '</span>',
                        '</div>',
                      ].join('')
                    : '',
                )
                .join(''),
              '</div>',
            ].join('')
          : '',
      ].join('')

      container.appendChild(legend)

      /**
       * V3 share buttons
       */
      if (config.share) {
        const shareContainer = document.createElement('DIV')
        shareContainer.setAttribute(
          'style',
          'position: absolute; top: 10px; right: 10px; display: flex; align-items: center;',
        )

        if (config.share.twitter) {
          shareContainer.innerHTML += [
            '<div class="share-twitter ">',
            '<svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">',
            '<path d="M19.2114 2.47374C18.5054 2.78403 17.7516 2.99543 16.9579 3.09195C17.7667 2.60455 18.3889 1.83638 18.6833 0.919827C17.9247 1.36255 17.0839 1.68482 16.1889 1.8643C15.4742 1.09931 14.4555 0.620697 13.3244 0.620697C11.1571 0.620697 9.39975 2.37802 9.39975 4.54294C9.39975 4.85404 9.43564 5.15318 9.50105 5.43955C6.2385 5.2856 3.34686 3.71893 1.41167 1.35058C1.07105 1.92652 0.880406 2.59579 0.880406 3.32487C0.880406 4.68892 1.5744 5.88785 2.62575 6.59222C1.98202 6.57147 1.37657 6.39439 0.848498 6.10083V6.1495C0.848498 8.05199 2.19899 9.63859 3.99619 9.99994C3.66674 10.0885 3.31895 10.1363 2.96238 10.1363C2.7119 10.1363 2.4718 10.1124 2.23169 10.0677C2.73504 11.6256 4.18204 12.7615 5.90426 12.7934C4.56414 13.8456 2.86585 14.4726 1.03675 14.4726C0.725653 14.4726 0.415351 14.4542 0.103455 14.4192C1.8496 15.5311 3.90684 16.1812 6.1316 16.1812C13.3539 16.1812 17.2984 10.2017 17.2984 5.02476C17.2984 4.85803 17.2984 4.68972 17.2865 4.52221C18.0531 3.9726 18.7223 3.27781 19.2488 2.48969L19.2114 2.47374Z" fill="#261A3A" />',
            '</svg>',
            '</div>',
          ].join('')

          addStyles(
            [
              '.share-twitter { margin-right: 8px; transition: all 100ms ease; cursor: pointer; width: 36px; height: 36px; border-radius: 100%; background: white; display: flex; align-items: center; justify-content: center; }',
              '.share-twitter:hover { transform: scale(1.05); }',
              '.share-twitter:active { transform: scale(.95); }',
            ].join(''),
          )
        }

        if (config.share.linkedin) {
          const secretClass = 'share-linkedin'

          shareContainer.innerHTML += [
            '<div class="' + secretClass + '">',
            '<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">',
            '<path d="M16.2012 15.6187H13.505V11.394C13.505 10.3865 13.4845 9.09008 12.1001 9.09008C10.6943 9.09008 10.4797 10.1863 10.4797 11.3196V15.6187H7.7835V6.93104H10.3734V8.11524H10.4083C10.7702 7.43249 11.6502 6.7118 12.9649 6.7118C15.6967 6.7118 16.2019 8.50973 16.2019 10.8501V15.6187H16.2012ZM4.73839 5.74228C3.87054 5.74228 3.17336 5.0398 3.17336 4.17573C3.17336 3.31242 3.87129 2.6107 4.73839 2.6107C5.60322 2.6107 6.30419 3.31242 6.30419 4.17573C6.30419 5.0398 5.60247 5.74228 4.73839 5.74228ZM6.09026 15.6187H3.38653V6.93104H6.09026V15.6187ZM17.5499 0.103455H2.03315C1.29046 0.103455 0.689636 0.690627 0.689636 1.41511V16.9987C0.689636 17.7239 1.29046 18.3104 2.03315 18.3104H17.5477C18.2896 18.3104 18.8965 17.7239 18.8965 16.9987V1.41511C18.8965 0.690627 18.2896 0.103455 17.5477 0.103455H17.5499Z" fill="#261A3A"/>',
            '</svg>',
            '</div>',
          ].join('')

          addStyles(
            [
              '.' +
                secretClass +
                ' { margin-right: 8px; transition: all 100ms ease; cursor: pointer; width: 36px; height: 36px; border-radius: 100%; background: white; display: flex; align-items: center; justify-content: center; }',
              '.' + secretClass + ':hover { transform: scale(1.05); }',
              '.' + secretClass + ':active { transform: scale(.95); }',
            ].join(''),
          )
        }

        container.appendChild(shareContainer)

        $(shareContainer.querySelectorAll('.share-twitter')).on(
          'click',
          function (e) {
            const url =
              'https://twitter.com/share?url=' +
              encodeURIComponent(window.location.href) +
              '&text=' +
              encodeURIComponent(document.title)
            const options =
              'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'

            window.open(url, '', options)
          },
        )

        $(shareContainer.querySelectorAll('.share-linkedin')).on(
          'click',
          function (e) {
            const url =
              'http://www.linkedin.com/shareArticle?mini=true&url=' +
              encodeURIComponent(window.location.href) +
              '&title=' +
              encodeURIComponent(document.title) // + summary & title
            const options =
              'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'

            window.open(url, '', options)
          },
        )
      }

      /**
       * V3 Custom dropdowns feature
       */
      if (config.selector) {
        /* Create drodowns container */
        const dropdownsContainer = document.createElement('DIV')
        dropdownsContainer.setAttribute(
          'style',
          'display: flex; align-items: center; justify-content: flex-start; margin-bottom: 24px;',
        )

        /* Create dropdowns */
        const selectClass = 'select-' + Math.random().toString().split('.')[1]
        dropdownsContainer.innerHTML = [
          /* TODO label feature (e.g. compare at) */
          '',
          /* Actual dropdowns string */
          config.selector.dropdowns
            .map(({ label, options }, dropdownIndex) =>
              [
                '<div data-hover="" data-delay="0" class="dropdown w-dropdown ' +
                  selectClass +
                  '" role="menu" aria-labelledby="w-dropdown-toggle-0" style="margin-left: 0px;">',
                '<div class="dropdown-toggle w-dropdown-toggle" tabindex="0" id="w-dropdown-toggle-0" aria-controls="w-dropdown-list-0" aria-haspopup="menu" style="outline: none;">',
                '<div class="icon w-icon-dropdown-toggle"></div>',
                '<div class="dropdown-text style="padding-top: 7px">' +
                  label +
                  '</div>',
                '</div>',
                '<nav class="dropdown-list w-dropdown-list" id="w-dropdown-list-0" style="display: block; opacity: 0; pointer-events: none;">',
                options
                  .map((option) =>
                    [
                      '<a href="#" class="w-dropdown-link" tabindex="-1" role="menuitem" style="outline: none;" data-value="' +
                        option.value +
                        '" data-index="' +
                        dropdownIndex +
                        '">',
                      option.label,
                      '</a>',
                    ].join(''),
                  )
                  .join(''),
                '</nav>',
                '</div>',
              ].join(''),
            )
            .join(''),
        ].join('')

        container.appendChild(dropdownsContainer)

        /* Add some styling */
        addStyles([
          '.' + selectClass + ' .w-dropdown-link:hover { background: #eee; }',
          '.' +
            selectClass +
            ' .w-dropdown-list { position: absolute; top: 0; transition: all 200ms ease; }',
        ])

        const openDropdown = (node) => {
          $(node.querySelector('.w-dropdown-list')).css('top', '54px')
          $(node.querySelector('.w-dropdown-list')).css('opacity', '1')
          $(node.querySelector('.w-dropdown-list')).css('pointer-events', 'all')
        }

        const closeDropdown = (node) => {
          $(node.querySelector('.w-dropdown-list')).css('top', '0')
          $(node.querySelector('.w-dropdown-list')).css('opacity', '0')
          $(node.querySelector('.w-dropdown-list')).css(
            'pointer-events',
            'none',
          )
        }

        let dropdownsValue = config.selector.dropdowns.map(
          (config) => config.default,
        )

        /* Make dropdowns drop down */
        $(
          container.querySelectorAll('.' + selectClass + ' .w-dropdown-toggle'),
        ).on('click', function (e) {
          openDropdown(this.parentNode)
        })

        /* Make options clickable */
        $(
          container.querySelectorAll('.' + selectClass + ' .w-dropdown-link'),
        ).on('click', function (e) {
          closeDropdown(this.parentNode.parentNode)

          const value = this.getAttribute('data-value')
          const index = this.getAttribute('data-index')

          dropdownsValue[index] = value
          config.selector.onChange(dropdownsValue, chart)

          const label = (
            config.selector.dropdowns[index].options
              .filter((option) => option.value === value)
              .pop() || {}
          ).label
          $(this.parentNode.parentNode.querySelector('.dropdown-text')).text(
            label,
          )
        })

        $(document.body).on('click', function (e) {
          if (!hasSomeParentTheClass(e.target, 'w-dropdown-toggle')) {
            $('.' + selectClass).each(function () {
              closeDropdown(this)
            })
          }
        })
      }

      /* Create a canvas for chart */
      const canvas = document.createElement('CANVAS')

      canvas.width = width
      canvas.height = height
      canvas.style.width = '100%'
      canvas.style.height = height + 'px'
      container.appendChild(canvas)

      /* Append wow mom chart component if presented */
      wowMomChart && container.appendChild(wowMomChart)

      /* TODO V3 bottom labels go here */
      if (config.bottomLabels) {
        const bottomLabelsContainer = document.createElement('DIV')
        bottomLabelsContainer.setAttribute(
          'style',
          'margin-top: 12px; display: flex; align-items: center; justify-content: center;',
        )

        config.bottomLabels.forEach((label, index) => {
          bottomLabelsContainer.innerHTML += [
            '<div style="vertical-align: middle; white-space: nowrap;">',
            '<span style="display: inline-block; vertical-align: middle; width: 16px; height: 16px; border-radius: 100%; background: ' +
              CHART_COLORS[index] +
              '"></span>',
            '<span style="vertical-align: middle; margin: 0 20px 0 10px">' +
              label +
              '</span>',
            '</div>',
          ].join('')
        })

        container.appendChild(bottomLabelsContainer)
      }

      /* Initialize chart */
      chart = new Chart(canvas.getContext('2d'), config)

      return chart
    })
  }

  function hideChart(selector) {
    $(selector).each(function () {
      this.remove()
    })
  }

  function showChartPreview() {
    const COLORS = {
      red: '#CE4645',
      green: '#407578',
    }

    $(function () {
      $('.graph-placeholder').each(function () {
        const container = document.createElement('div')
        container.setAttribute('style', 'height: 100%; width: 100%;')
        this.style.padding = '20px'
        this.appendChild(container)

        const industryName = $(this).attr('data-industry')
        const values = INDUSTRY_VALUES[industryName]

        if (!values) {
          console.error('Industry ', industryName, ' is unknown.')
          return
        }

        const { width, height } = container.getBoundingClientRect()
        const canvas = document.createElement('CANVAS')
        canvas.width = width
        canvas.height = height
        canvas.style.width = '100%'
        canvas.style.height = height + 'px'

        container.appendChild(canvas)

        const positive =
          values[values.length - 1] - values[values.length - 2] > 0

        new Chart(canvas.getContext('2d'), {
          type: 'line',
          data: {
            labels: new Array(24).fill(''),
            datasets: [
              {
                data: values,
                fill: false,
                borderWidth: 2,
                borderColor: positive ? COLORS.green : COLORS.red,
                pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                pointBorderColor: 'rgba(0, 0, 0, 0)',
                pointHoverBorderColor: 'rgba(0, 0, 0, 0)',
                pointHitRadius: 30,
              },
            ],
          },
          options: {
            legend: { display: false },
            tooltips: { display: false, enabled: false },
            scales: {
              xAxes: [
                {
                  gridLines: {
                    display: false,
                    drawBorder: false,
                    zeroLineWidth: 0,
                  },
                  ticks: { display: false },
                },
              ],
              yAxes: [
                {
                  gridLines: {
                    lineWidth: 0,
                    drawBorder: false,
                    drawOnChartArea: false,
                    zeroLineWidth: 0,
                  },
                  ticks: { display: false },
                },
              ],
            },
          },
        })
      })
    })
  }

  /**
   * Paywall stuff
   */
  let __overlayRef = null
  let __formRef = null
  function showPaywall() {
    document.body.style.transform = 'none'

    if (__overlayRef === null) {
      const overlay = document.createElement('DIV')
      const form = document.getElementById('report-locked')

      if (!form) return

      overlay.setAttribute(
        'style',
        'position: fixed; height: 100vh; width: 100vw; bottom: 0; z-index: 9999; transition: all 200ms ease; background: rgba(53,53,53,0); opacity: 1;',
      )
      form.setAttribute(
        'style',
        'position: absolute; opacity: 0; bottom: -40px; left: 0; width: 100%; height: 65vh; display: block; transition: all 200ms ease;',
      )

      document.body.appendChild(overlay)
      overlay.appendChild(form)

      __overlayRef = overlay
      __formRef = form
    }

    __overlayRef.style.display = 'block'
    __overlayRef.style.opacity = '1.0'
    __overlayRef.style.pointerEvents = 'all'

    document.body.style.overflow = 'hidden'

    setTimeout(() => {
      __overlayRef.style.background = 'rgba(53, 53, 53, 0.77)'
      __formRef.style.opacity = '1'
      __formRef.style.bottom = '0px'
    }, 50)
  }

  function hidePaywall() {
    document.body.style.overflow = 'unset'

    __overlayRef.style.opacity = '0.0'
    __overlayRef.style.pointerEvents = 'none'
    __formRef.style.opacity = '0'
    __formRef.style.bottom = '-40px'

    setTimeout(() => {
      __overlayRef.style.display = 'none'
    }, 50)
  }

  /**
   * The main function that checks whether the user has already filled
   * the paywall form and display it if not. If user closes the form /
   * fills it, the callback is called - only parameter is true if user
   * fills the form successfully, if closes by clicking "back" - false
   */
  function displayPaywall(options = {}, hideCallback) {
    /* Do not show the paywal if user comes from email */
    if (new URLSearchParams(window.location.search).get('medium') === 'email') {
      localStorage.setItem('form-submitted', 'true')
      window.history.replaceState(null, null, window.location.pathname)
    }

    /* Do not show the paywall if it was ever submitted */
    if (localStorage.getItem('form-submitted') === 'true') {
      hideCallback && hideCallback(true)
      return
    }

    showPaywall()

    /* Hide the paywall after submit */
    $('#email-form-overlay').on('submit', function () {
      setTimeout(() => {
        if (
          $('#email-form-overlay .success-message.w-form-done').css(
            'display',
          ) === 'block'
        ) {
          localStorage.setItem('form-submitted', 'true')
          hidePaywall()
          hideCallback && hideCallback(true)
        }
      }, 2000)
    })

    if (!options.canBack) {
      $('.link-2.w--current').css('display', 'none')
      $('.button---grey.w-button').css('display', 'none')
    }

    /* Back button click in old overlay*/
    $('.link-2.w--current').on('click', (e) => {
      e.preventDefault()
      hidePaywall()
      hideCallback && hideCallback(false)
    })

    /* Back button click in new overlay */
    $('.button---grey.w-button').on('click', (e) => {
      e.preventDefault()
      hidePaywall()
      hideCallback && hideCallback(false)
    })
  }

  /**
   * Custom tooltips (V3 feature)
   */
  const pelotonCustomTooltip = (tooltipConfig) => {
    let tooltipEl = document.getElementById('chartjs-tooltip')

    if (!tooltipEl) {
      tooltipEl = document.createElement('div')
      tooltipEl.id = 'chartjs-tooltip'

      document.body.appendChild(tooltipEl)
    }

    tooltipEl.style.transition = 'all 200ms ease'
    tooltipEl.style.position = 'absolute'
    tooltipEl.style.pointerEvents = 'none'
    tooltipEl.style.zIndex = '200000'

    return function (tooltipModel) {
      if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = 0
        return
      }

      tooltipEl.classList.remove('above', 'below', 'no-transform')
      tooltipEl.classList.add(
        tooltipModel.yAlign ? tooltipModel.yAlign : 'no-transform',
      )

      const label = tooltipConfig.label
        ? tooltipConfig.label(tooltipModel.dataPoints[0])
        : ''
      const value = tooltipConfig.value
        ? tooltipConfig.value(tooltipModel.dataPoints[0])
        : ''
      const date = tooltipConfig.date
        ? tooltipConfig.date(tooltipModel.dataPoints[0])
        : tooltipModel.title.slice().shift()

      tooltipEl.innerHTML = [
        '<div style="position: relative; background: #251B39; padding: 20px 12px; border-radius: 4px;">',
        label || value
          ? '<div style="color: white; font-family: NeueMontreal; font-size: 14px;">' +
            label +
            ' <strong>' +
            value +
            '</strong></div>'
          : '',
        date
          ? '<div style="color: white; font-family: NeueMontreal; font-size: 12px; opacity: .54">' +
            date +
            '</div>'
          : '',
        '<div style="bottom: -8px; position: absolute; width: 0; height: 0; border-style: solid; border-width: 8px 8px 0 8px; border-color: #251B39 transparent transparent transparent;"></div>',
        '</div>',
      ].join('')

      const position = this._chart.canvas.getBoundingClientRect()
      const { height } = tooltipEl.getBoundingClientRect()

      tooltipEl.style.opacity = 1
      tooltipEl.style.left =
        position.left + window.pageXOffset + tooltipModel.caretX - 20 + 'px'
      tooltipEl.style.top =
        position.top +
        window.pageYOffset +
        tooltipModel.caretY -
        height -
        13 +
        'px'
    }
  }

  function momWowRender() {
    // window.cardify.loadScript('https://d2j940tllnytyh.cloudfront.net/cardify/index/data/wow-mom.js')

    const NAME_MAPPING = {
      Travel: 'travel',
      'Financial Investments': 'financial',
      'Grocery and Wholesale': 'grocery',
      'Apparel and Accessories': 'apparel',
      Restaurants: 'restaurants',
      'Gas Stations': 'gas',
      Computers: 'computers',
      'Personal Care': 'care',
      Beauty: 'beauty',
    }

    let data = {}
    for (const key in INDUSTRY_VALUES) {
      const value = INDUSTRY_VALUES[key]

      const last = value[value.length - 1]
      const prelast = value[value.length - 2]

      const lastsum = value.slice(-4).reduce((acc, i) => acc + i, 0)
      const prelastsum = value.slice(-8, -4).reduce((acc, i) => acc + i, 0)

      data[NAME_MAPPING[key]] = {
        wow: (100 * (last - prelast)) / prelast,
        mom: (100 * (lastsum - prelastsum)) / prelastsum,
      }
    }

    console.log('Index wow mom data', data)

    $('.wow-mom-change').each(function () {
      const type = $(this).attr('data-type')
      const industry = $(this).attr('data-industry')

      try {
        const value = data[industry][type]

        $(this).text(
          `${value.toFixed(1)}% ${type === 'wow' ? 'WoW' : 'MoM'} ${
            value > 0 ? '▲' : '▼'
          }`,
        )
        $(this).removeClass('wow-mom---small-decline')
        $(this).removeClass('wow-mom---small-incline')
        $(this).addClass(
          value > 0 ? 'wow-mom---small-incline' : 'wow-mom---small-decline',
        )
      } catch (error) {
        console.error(
          'Cannot fill wow mom for',
          type,
          industry,
          'becaus of',
          error,
        )
      }
    })

    $('.wow-mom-card').each(function () {
      const type = $(this).attr('data-type')
      const industry = $(this).attr('data-industry')

      try {
        const value = data[industry][type]

        const arrow = $(this.querySelector('[class^="arrow"]'))
        const text = $(this.querySelector('[class^="wow"]'))

        $(arrow).text(value > 0 ? '↑' : '↓')
        $(arrow).removeClass('arrow-up')
        $(arrow).removeClass('arrow-down')
        $(arrow).addClass(value > 0 ? 'arrow-up' : 'arrow-down')
        $(text).text(`${value.toFixed(1)}% ${type === 'wow' ? 'WoW' : 'MoM'}`)
        $(text).removeClass('wow---incline-text')
        $(text).removeClass('wow---decline-text')
        $(text).addClass(
          value > 0 ? 'wow---incline-text' : 'wow---decline-text',
        )
      } catch (error) {
        console.error(
          'Cannot fill wow mom for',
          type,
          industry,
          'becaus of',
          error,
        )
      }
    })

    /**
     * State Charts data
     */
    const STATE_CHARTS_DATA = [
      {
        state: 'California',
        industry: '9. Beauty Products',
        data:
          '[100, 142, 122, 120, 129, 154, 116, 82, 72, 104, 69, 92, 131, 147, 147, 92, 116, 111, 120]',
      },
      {
        state: 'Florida',
        industry: '9. Beauty Products',
        data:
          '[100, 144, 110, 108, 120, 160, 104, 83, 60, 98, 52, 83, 96, 113, 120, 85, 119, 125, 130]',
      },
      {
        state: 'Illinois',
        industry: '9. Beauty Products',
        data:
          '[100, 132, 96, 107, 127, 141, 100, 77, 69, 108, 59, 93, 115, 129, 143, 82, 118, 113, 99]',
      },
      {
        state: 'New Jersey',
        industry: '9. Beauty Products',
        data:
          '[100, 129, 96, 128, 128, 137, 104, 78, 64, 91, 57, 84, 146, 128, 143, 97, 108, 116, 113]',
      },
      {
        state: 'New York',
        industry: '9. Beauty Products',
        data:
          '[100, 135, 108, 116, 134, 139, 109, 77, 64, 92, 65, 90, 144, 153, 149, 102, 127, 103, 116]',
      },
      {
        state: 'Texas',
        industry: '9. Beauty Products',
        data:
          '[100, 149, 106, 113, 142, 161, 111, 88, 65, 104, 68, 80, 115, 139, 151, 111, 137, 141, 150]',
      },
    ]

    STATE_CHARTS_DATA.forEach(({ state, industry, data }) => {
      $(
        `.state-chart[data-state="${state}"][data-industry="${industry}"]`,
      ).each(function () {
        const node = $(this)

        /* Draw chart */
        const placeholder = node[0].querySelector('.graph-placeholder---large')

        const COLORS = {
          red: '#CE4645',
          green: '#407578',
        }

        const container = document.createElement('div')
        container.setAttribute('style', 'height: 100%; width: 100%;')
        // this.style.padding = '20px';
        placeholder.appendChild(container)

        // const industryName = $(this).attr('data-industry');
        let values
        try {
          values = JSON.parse(data)
        } catch (err) {
          console.error(err)
        }

        if (!values) {
          console.error('Industry ', industryName, ' is unknown.')
          return
        }

        const { width, height } = container.getBoundingClientRect()
        const canvas = document.createElement('CANVAS')
        canvas.width = width
        canvas.height = height
        canvas.style.width = '100%'
        canvas.style.height = height + 'px'

        container.appendChild(canvas)

        const positive =
          values[values.length - 1] - values[values.length - 2] > 0

        new Chart(canvas.getContext('2d'), {
          type: 'line',
          data: {
            labels: new Array(19).fill(''),
            datasets: [
              {
                data: values,
                fill: false,
                borderWidth: 2,
                borderColor: positive ? COLORS.green : COLORS.red,
                pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                pointBorderColor: 'rgba(0, 0, 0, 0)',
                pointHoverBorderColor: 'rgba(0, 0, 0, 0)',
                pointHitRadius: 30,
              },
            ],
          },
          options: {
            legend: { display: false },
            tooltips: { display: false, enabled: false },
            scales: {
              xAxes: [
                {
                  gridLines: {
                    display: false,
                    drawBorder: false,
                    zeroLineWidth: 0,
                  },
                  ticks: { display: false },
                },
              ],
              yAxes: [
                {
                  gridLines: {
                    lineWidth: 0,
                    drawBorder: false,
                    drawOnChartArea: false,
                    zeroLineWidth: 0,
                  },
                  ticks: { display: false },
                },
              ],
            },
          },
        })

        const last = values[values.length - 1]
        const prelast = values[values.length - 2]

        const lastsum = values.slice(-4).reduce((acc, i) => acc + i, 0)
        const prelastsum = values.slice(-8, -4).reduce((acc, i) => acc + i, 0)

        const wow = (100 * (last - prelast)) / prelast
        const mom = (100 * (lastsum - prelastsum)) / prelastsum

        /* Set title */
        $(node[0].querySelectorAll('.paragraph-regular.bold')).text(state)

        /* Set wow moms - skipping for now */
        $(node[0].querySelectorAll('.wow-mom-change')).each(function () {
          const type = $(this).attr('data-type')

          try {
            const value = type === 'wow' ? wow : mom

            $(this).text(
              `${value.toFixed(1)}% ${type === 'wow' ? 'WoW' : 'MoM'} ${
                value > 0 ? '▲' : '▼'
              }`,
            )
            $(this).removeClass('wow-mom---small-decline')
            $(this).removeClass('wow-mom---small-incline')
            $(this).addClass(
              value > 0 ? 'wow-mom---small-incline' : 'wow-mom---small-decline',
            )
          } catch (error) {
            console.error(
              'Cannot fill wow mom for',
              type,
              industry,
              'because of',
              error,
            )
          }
        })
      })
    })
  }

  function emailValidationInit() {
    const RULES = {
      'work-email': (input) => {
        const bannedEmailDomains = [
          '@gmail.com',
          '@hotmail.com',
          '@outlook.com',
          '@live.com',
          '.me',
          '@yahoo.com',
        ]

        const isEmailBanned = bannedEmailDomains.reduce(
          (acc, domain) => acc || $(input).val().endsWith(domain),
          false,
        )
        input.setCustomValidity(
          isEmailBanned ? 'Please use your work email address' : '',
        )
      },
    }

    $(document.body).on('input', function (e) {
      const validation = $(e.target).attr('data-cardify-validation')

      if (validation) {
        let validationRules = []
        try {
          validationRules = JSON.parse(validation)
        } catch (e) {
          console.error('Cannot parse validation rules', this, validation)
        }

        validationRules.forEach((rule) => {
          if (!RULES[rule]) {
            console.error('The rule has no function', rule)
          } else {
            RULES[rule](e.target)
          }
        })
      }
    })
  }

  const loadCardifyIndustry = (industryKey, colorsMapping, bottomLabels) => {
    Chart.defaults.global.tooltips.displayColors = false
    Chart.defaults.global.hover.mode = 'nearest'
    Chart.defaults.global.hover.intersect = false
    Chart.defaults.global.legend.display = false
    Chart.defaults.global.responsive = false

    setTimeout(window.cardify.displayPaywall, 2000)

    const data = window.$cardifyScripts.industryData.filter(
      (entry) => entry.industry === industryKey,
    )
    console.log('Finished loading data for page ' + industryKey, data)
    window.cardify.showChart('#travel-graph-container', {
      bottomLabels,
      height: 350,
      type: 'line',
      data: {
        labels: data.map((entry) => entry.dates),
        datasets: data.map((entry) => {
          let data
          try {
            data = JSON.parse(entry.data)
          } catch (error) {
            console.log(error)
          }
          return {
            ...entry,
            hidden: entry.gender !== 'all' || entry.age !== 'all',
            label: entry.category,
            data,
            fill: false,
            borderWidth: 2,
            borderColor: colorsMapping[entry.category],
            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
            pointBorderColor: 'rgba(0, 0, 0, 0)',
            pointHoverBorderColor: window.cardify.CHART_COLORS[0],
            pointHitRadius: 30,
          }
        }),
      },
      share: { twitter: true, linkedin: true },
      selector: {
        dropdowns: [
          {
            label: 'Gender',
            options: [
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'all', label: 'All' },
              { value: 'other', label: 'Other' },
            ],
            default: 'all',
          },
          {
            label: 'Age',
            options: [
              { value: 'under 25', label: 'Under 25' },
              { value: '25-34', label: '25-34' },
              { value: '35+', label: '35+' },
              { value: 'all', label: 'All' },
            ],
            default: 'all',
          },
        ],
        onChange: ([gender, age], chart) => {
          chart.data.datasets.forEach((dataset) => {
            dataset.hidden = dataset.gender !== gender || dataset.age !== age
          })
          chart.update()
        },
      },

      legend: {
        heading: industryKey,
        labels: [''], // use V3 bottom labels there
        disableMinHegiht: true, // use V3 non fixed height option
      },

      options: Object.assign({}, window.cardify.simpleLineOptions(), {
        tooltips: {
          display: false,
          enabled: false,
          custom: window.cardify.tooltips.pelotonCustomTooltip({
            label: (data) => 'Indexed Spend',
            value: (data) => data.value,
          }),
        },
      }),
    })[0]
  }

  const randomId = 'industry' + Math.random().toString(16).split('.')[1]
  document.currentScript.setAttribute('data-content-id', randomId)

  window.$cardifyScripts.financialData = [
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 51.5, 62.8, 86.5, 77.0, 145.4, 140.7, 160.6, 152.8, 53.9, 90.5]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 75.8, 92.0, 97.6, 128.1, 96.5, 145.2, 125.7, 103.4, 97.3, 96.2]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 57.7, 83.9, 106.3, 129.4, 138.8, 140.1, 107.3, 108.8, 71.3, 68.0]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 101.8, 84.0, 114.4, 184.9, 164.1, 178.0, 146.4, 124.9, 103.8, 93.7]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 90.9, 168.1, 121.4, 195.8, 156.5, 133.4, 187.7, 173.3, 99.9, 112.6]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 85.9, 124.5, 104.0, 143.8, 147.6, 182.5, 162.8, 125.0, 107.3, 97.3]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 101.6, 183.8, 115.9, 186.1, 190.1, 216.5, 206.1, 139.7, 146.3, 108.4]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 34.9, 43.9, 69.9, 112.3, 122.2, 86.1, 166.0, 104.2, 26.2, 38.5]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 57.7, 93.6, 80.2, 122.8, 61.5, 108.9, 75.6, 96.1, 90.3, 44.9]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 57.8, 60.6, 34.3, 194.9, 125.8, 311.8, 218.3, 171.2, 468.7, 276.7]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 82.4, 85.0, 114.6, 166.3, 107.6, 136.6, 104.9, 101.8, 70.0, 83.6]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 81.0, 79.8, 135.2, 197.6, 149.5, 136.2, 119.0, 149.2, 92.2, 94.0]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 57.5, 77.9, 105.9, 128.0, 131.3, 135.8, 116.6, 105.0, 66.4, 61.7]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 117.5, 85.1, 136.6, 258.4, 230.8, 177.4, 158.6, 160.0, 127.8, 106.2]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 81.0, 97.6, 138.2, 171.4, 118.6, 151.0, 115.3, 116.0, 85.2, 82.5]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 82.2, 106.4, 154.8, 181.7, 118.7, 154.8, 114.9, 111.5, 101.9, 83.0]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 119.4, 86.0, 142.0, 119.4, 182.5, 229.7, 168.0, 98.5, 99.2, 238.2]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 59.6, 94.2, 80.9, 129.5, 68.2, 132.8, 84.2, 105.8, 117.4, 61.4]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 96.8, 110.4, 153.7, 186.8, 126.9, 174.6, 123.9, 133.4, 95.2, 102.1]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 80.7, 170.1, 102.5, 112.5, 159.6, 203.1, 203.3, 131.5, 107.1, 112.5]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 70.7, 101.0, 116.8, 160.9, 145.3, 137.7, 127.6, 132.9, 82.7, 84.2]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 84.9, 94.1, 102.5, 161.1, 111.2, 167.0, 262.0, 138.9, 121.9, 95.0]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 91.7, 92.1, 122.9, 188.8, 143.8, 147.0, 106.1, 104.1, 108.2, 112.9]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 86.8, 95.6, 133.2, 175.1, 114.7, 152.1, 115.2, 123.2, 75.9, 88.2]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 90.9, 81.2, 97.0, 124.3, 114.5, 180.4, 115.2, 91.3, 79.4, 82.4]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 76.8, 101.5, 173.7, 176.3, 101.8, 161.8, 105.8, 103.8, 99.7, 65.6]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 112.4, 73.9, 191.0, 146.8, 42.8, 195.8, 132.0, 50.9, 93.8, 24.7]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 110.4, 180.2, 198.1, 157.8, 113.1, 348.9, 12.5, 207.5, 48.7, 14.0]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 73.4, 74.4, 93.8, 103.5, 128.4, 165.1, 134.1, 120.7, 67.5, 85.0]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 78.3, 91.1, 139.9, 169.1, 105.5, 146.4, 107.3, 102.8, 82.0, 74.0]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 92.5, 258.8, 105.2, 134.9, 164.6, 239.4, 238.8, 124.0, 144.1, 102.0]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 100.5, 129.6, 179.5, 187.5, 116.8, 198.6, 139.7, 165.6, 83.3, 97.2]',
    },
  ]

  const randomId$1 = 'industry' + Math.random().toString(16).split('.')[1]
  document.currentScript.setAttribute('data-content-id', randomId$1)

  window.$cardifyScripts.industryData = [
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 100.8, 111.0, 124.1, 117.9, 133.1, 115.7, 73.5, 58.0, 60.1, 65.1, 78.6, 81.3, 83.0, 86.2, 82.4, 100.6, 104.8, 107.5, 115.1, 119.4, 113.8, 121.7]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 107.9, 118.0, 113.0, 124.5, 156.9, 117.0, 74.3, 70.6, 72.5, 90.8, 90.3, 98.9, 107.5, 103.7, 93.8, 116.3, 117.4, 125.5, 117.3, 131.6, 127.5, 130.0]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 104.8, 143.4, 118.5, 124.8, 135.1, 117.4, 85.9, 66.8, 66.4, 68.5, 79.0, 89.5, 86.2, 87.2, 94.5, 108.3, 109.7, 109.4, 121.8, 124.7, 129.1, 134.6]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 106.4, 112.9, 119.4, 120.1, 133.0, 118.3, 75.5, 60.2, 67.5, 71.2, 81.8, 88.7, 89.9, 91.4, 89.6, 110.0, 115.3, 114.1, 127.3, 130.3, 124.2, 128.1]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 97.5, 112.4, 126.1, 106.9, 114.9, 101.3, 68.5, 61.9, 57.9, 54.6, 69.9, 72.4, 77.3, 84.1, 78.4, 97.8, 103.9, 95.3, 106.3, 110.1, 110.5, 115.8]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 107.1, 111.7, 119.1, 121.3, 133.9, 116.4, 75.5, 62.2, 71.3, 72.7, 82.7, 91.8, 91.7, 91.5, 88.3, 107.4, 108.8, 109.6, 122.4, 125.8, 119.0, 121.4]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 111.0, 117.9, 119.9, 116.8, 125.9, 123.2, 74.9, 58.6, 66.0, 72.1, 80.0, 88.5, 92.0, 96.3, 101.4, 125.6, 141.8, 130.0, 151.2, 151.1, 149.9, 151.7]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 101.8, 110.5, 111.2, 96.5, 106.8, 104.4, 72.3, 65.3, 53.3, 49.7, 69.1, 71.9, 82.6, 72.6, 82.7, 103.0, 109.9, 109.7, 111.4, 128.8, 130.5, 140.4]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 96.2, 114.0, 121.6, 110.2, 116.7, 98.1, 69.1, 62.5, 59.7, 56.6, 72.4, 71.3, 75.5, 89.4, 77.1, 100.0, 108.4, 91.5, 107.8, 106.5, 104.1, 109.2]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 107.6, 126.8, 118.4, 117.7, 127.3, 119.0, 78.8, 62.4, 64.8, 68.3, 78.5, 87.1, 88.8, 90.3, 96.8, 116.6, 126.1, 119.9, 135.7, 138.6, 139.9, 144.0]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 101.5, 111.5, 119.4, 120.3, 136.9, 118.2, 76.0, 57.6, 60.9, 67.5, 81.3, 82.7, 84.5, 87.2, 83.0, 102.8, 107.7, 110.7, 118.7, 122.9, 114.6, 123.1]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 104.8, 116.1, 120.3, 118.5, 130.6, 115.4, 75.4, 61.4, 65.8, 68.5, 79.7, 86.3, 87.6, 89.9, 88.4, 107.8, 112.9, 110.7, 123.1, 126.3, 122.5, 126.9]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 104.6, 100.9, 114.8, 123.9, 137.4, 116.9, 67.4, 65.4, 56.8, 74.7, 92.1, 88.2, 81.0, 89.6, 95.9, 108.1, 115.2, 118.8, 119.5, 125.0, 121.5, 150.2]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 97.2, 110.7, 144.3, 107.5, 117.1, 105.3, 64.8, 58.6, 57.4, 54.0, 65.7, 75.0, 77.1, 81.7, 78.0, 90.2, 91.5, 92.8, 99.9, 104.4, 109.3, 111.9]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 105.1, 112.3, 119.4, 119.3, 131.4, 113.0, 74.3, 62.5, 69.2, 70.2, 81.0, 88.2, 89.2, 91.5, 86.4, 106.3, 109.0, 106.8, 119.6, 122.5, 116.5, 119.4]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 105.1, 138.4, 117.7, 124.7, 137.6, 117.3, 83.6, 67.1, 66.5, 71.2, 80.9, 90.4, 88.2, 89.2, 94.5, 109.1, 110.9, 111.6, 121.2, 125.5, 128.5, 134.9]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 158.3, 116.7, 109.9, 133.9, 123.0, 93.0, 78.1, 49.4, 63.8, 71.4, 75.7, 105.7, 90.5, 104.6, 83.0, 113.2, 116.6, 124.2, 94.5, 141.7, 122.5, 124.1]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 131.6, 107.2, 111.6, 121.5, 133.7, 107.3, 77.9, 61.0, 92.5, 63.5, 89.0, 124.9, 136.6, 144.7, 98.8, 126.8, 109.6, 121.2, 85.5, 95.1, 94.5, 116.7]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 145.9, 110.1, 123.1, 128.6, 147.0, 100.4, 84.5, 66.8, 106.1, 63.7, 90.7, 105.0, 124.6, 149.1, 89.0, 123.0, 127.5, 134.5, 101.6, 101.1, 101.9, 135.3]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 164.4, 114.9, 123.2, 128.4, 215.0, 117.5, 83.0, 72.0, 102.5, 65.6, 78.0, 82.4, 104.4, 108.5, 89.3, 115.4, 129.1, 121.4, 91.0, 107.4, 110.6, 149.4]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 134.3, 107.1, 119.9, 128.2, 142.3, 102.1, 79.8, 67.8, 98.7, 63.9, 95.0, 140.1, 147.5, 161.3, 103.4, 125.3, 120.4, 123.1, 85.7, 91.9, 98.6, 129.0]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 147.7, 110.2, 123.6, 127.9, 153.6, 101.9, 85.0, 67.2, 105.4, 63.9, 89.5, 103.8, 122.5, 144.5, 89.2, 121.7, 127.7, 134.4, 99.9, 102.2, 102.7, 136.2]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 131.2, 102.5, 95.2, 117.3, 127.4, 108.8, 74.8, 51.1, 79.8, 69.7, 102.9, 90.7, 113.3, 110.1, 92.8, 96.0, 97.8, 103.5, 100.2, 93.0, 94.1, 106.6]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 129.7, 104.7, 110.4, 125.7, 136.9, 106.8, 77.7, 59.5, 89.1, 62.1, 89.0, 119.9, 129.6, 138.1, 101.8, 125.1, 115.5, 129.9, 94.2, 103.9, 101.7, 133.3]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 129.1, 105.7, 108.3, 135.9, 141.3, 84.0, 72.1, 66.2, 98.9, 67.2, 93.4, 133.9, 129.6, 155.6, 105.8, 119.6, 103.6, 112.2, 80.3, 81.8, 92.6, 132.9]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 133.8, 106.7, 117.6, 127.6, 141.0, 102.1, 79.2, 66.4, 97.2, 64.5, 95.5, 135.9, 144.1, 157.0, 102.6, 122.8, 118.0, 121.2, 86.7, 91.7, 98.0, 127.3]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 144.1, 99.8, 135.0, 109.4, 144.4, 97.0, 102.3, 65.1, 94.7, 62.1, 90.9, 132.0, 121.9, 130.7, 92.6, 107.3, 127.3, 166.8, 82.3, 113.9, 100.5, 124.1]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 135.7, 106.9, 116.8, 127.1, 142.6, 103.5, 80.1, 64.5, 96.6, 63.6, 92.2, 123.9, 135.0, 148.5, 99.3, 123.2, 119.4, 126.7, 91.9, 97.7, 100.2, 131.1]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 126.7, 102.5, 109.8, 127.6, 139.7, 107.4, 77.6, 59.3, 88.7, 60.6, 89.8, 117.9, 128.1, 136.5, 104.7, 124.9, 118.8, 135.2, 99.1, 106.5, 104.4, 143.4]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 135.4, 106.8, 118.4, 128.2, 142.8, 102.9, 80.5, 65.6, 98.2, 63.1, 92.7, 126.5, 137.5, 152.7, 100.2, 124.7, 121.8, 128.6, 92.6, 97.5, 100.7, 133.8]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 145.7, 108.6, 106.1, 123.4, 153.3, 108.9, 77.8, 57.1, 84.1, 68.7, 90.9, 90.6, 106.8, 108.7, 90.1, 104.7, 110.4, 112.3, 96.5, 105.4, 103.8, 122.5]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 132.1, 106.6, 112.7, 122.5, 135.3, 103.8, 78.7, 61.9, 93.4, 63.9, 89.7, 126.4, 134.8, 145.1, 99.3, 124.7, 110.0, 123.0, 84.7, 94.7, 94.7, 119.1]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 121.2, 116.3, 122.0, 144.3, 151.4, 126.5, 138.4, 134.4, 147.6, 145.0, 192.5, 197.2, 178.0, 165.1, 149.9, 167.1, 162.0, 150.0, 150.7, 163.0, 136.2, 120.5]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 109.8, 112.6, 119.2, 124.3, 133.2, 122.2, 134.5, 124.2, 133.2, 134.7, 162.8, 172.9, 153.2, 152.0, 137.8, 152.2, 152.0, 144.2, 142.4, 144.7, 125.4, 99.4]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 104.7, 107.2, 105.7, 108.4, 123.4, 118.3, 125.6, 122.6, 125.1, 125.7, 162.5, 170.0, 154.4, 149.6, 141.9, 165.8, 143.5, 149.9, 146.5, 163.8, 135.9, 128.6]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 109.7, 110.3, 111.8, 124.6, 126.8, 117.0, 124.2, 127.2, 130.3, 134.8, 162.8, 181.5, 162.9, 160.0, 153.8, 173.6, 162.8, 162.8, 164.8, 171.9, 157.9, 132.0]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 106.7, 111.4, 107.2, 107.8, 135.9, 114.3, 142.5, 115.6, 136.4, 133.6, 158.0, 186.4, 155.9, 140.0, 137.1, 142.7, 125.2, 158.9, 136.4, 171.3, 129.9, 104.3]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 115.1, 113.1, 116.0, 131.0, 141.5, 123.3, 134.3, 129.8, 139.7, 138.1, 181.3, 187.7, 169.3, 159.0, 146.8, 165.8, 154.5, 150.3, 148.8, 163.6, 135.9, 122.6]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 107.2, 109.0, 119.1, 131.3, 131.2, 115.7, 124.5, 120.2, 125.2, 132.8, 157.0, 167.8, 152.4, 149.6, 145.1, 168.3, 157.2, 169.2, 158.9, 167.5, 138.5, 139.6]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 111.2, 111.4, 114.2, 125.2, 133.1, 119.5, 131.4, 126.0, 132.7, 133.6, 168.1, 178.6, 162.6, 155.6, 144.3, 163.5, 154.1, 151.2, 151.1, 161.2, 138.6, 119.7]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 105.4, 108.4, 104.7, 118.2, 123.9, 114.8, 118.1, 124.7, 128.1, 130.4, 157.2, 176.4, 160.8, 161.2, 145.1, 163.2, 155.3, 153.8, 158.9, 162.9, 161.8, 117.5]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 124.0, 117.0, 117.0, 128.8, 126.5, 124.2, 138.1, 144.5, 144.0, 148.6, 185.5, 215.6, 184.9, 173.9, 188.4, 207.0, 189.7, 173.6, 188.4, 200.5, 179.9, 153.9]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 114.1, 113.3, 117.2, 132.2, 139.5, 122.5, 132.6, 129.1, 138.7, 138.5, 175.4, 185.0, 166.5, 160.2, 145.1, 161.6, 157.4, 149.1, 150.1, 157.5, 138.8, 113.4]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 100.0, 110.1, 83.6, 126.4, 126.4, 143.2, 104.1, 105.3, 109.0, 122.5, 143.7, 158.8, 144.6, 167.0, 121.4, 161.2, 135.8, 124.0, 144.8, 161.1, 106.5, 88.1]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 100.5, 104.0, 105.3, 98.3, 110.7, 100.0, 137.0, 108.6, 106.2, 104.7, 131.5, 135.9, 148.2, 129.1, 115.3, 142.1, 128.8, 134.2, 135.3, 147.7, 118.8, 109.7]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 106.5, 109.4, 114.7, 127.8, 131.4, 117.7, 125.3, 118.4, 125.4, 132.1, 156.1, 169.5, 152.2, 149.7, 142.2, 164.4, 151.2, 164.2, 154.8, 167.5, 134.8, 130.8]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 106.6, 109.9, 113.7, 116.4, 126.0, 116.1, 134.2, 118.8, 124.1, 125.1, 152.5, 161.1, 151.4, 145.5, 130.3, 149.4, 144.3, 140.4, 140.3, 146.2, 122.7, 102.2]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 107.3, 108.2, 107.8, 109.5, 120.3, 114.2, 131.4, 122.9, 123.4, 124.2, 158.1, 169.2, 158.7, 148.5, 143.5, 167.1, 148.5, 150.1, 151.6, 166.5, 139.8, 128.2]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 100.5, 102.2, 101.2, 110.9, 108.4, 100.6, 85.0, 60.9, 61.5, 58.0, 62.1, 63.6, 67.6, 70.1, 68.0, 81.3, 84.5, 92.3, 93.0, 97.7, 96.7, 100.6]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 96.4, 103.2, 98.1, 103.6, 104.4, 97.2, 78.3, 56.2, 57.3, 55.7, 58.4, 60.3, 62.8, 64.5, 61.8, 75.0, 77.5, 84.8, 86.4, 88.9, 87.9, 94.2]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 105.9, 101.6, 104.1, 108.7, 114.6, 104.2, 84.0, 59.2, 61.8, 59.2, 65.0, 64.3, 68.2, 70.9, 65.6, 76.8, 80.7, 89.6, 88.8, 91.9, 90.4, 96.0]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 105.2, 100.6, 103.9, 110.7, 113.9, 103.2, 84.5, 59.5, 62.7, 59.3, 64.9, 64.9, 68.3, 71.2, 67.3, 79.0, 82.9, 90.9, 89.4, 93.7, 94.2, 98.8]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 84.4, 86.2, 80.9, 91.7, 92.1, 84.1, 68.8, 55.0, 47.2, 54.1, 54.5, 53.5, 60.4, 61.8, 57.3, 64.1, 72.4, 80.2, 79.5, 82.3, 80.5, 83.1]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 104.2, 101.5, 104.3, 110.1, 113.2, 102.3, 82.4, 58.8, 59.8, 58.3, 63.7, 62.8, 67.6, 68.9, 63.5, 74.2, 79.9, 87.6, 86.4, 89.0, 89.8, 94.3]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 94.9, 100.7, 96.6, 102.2, 104.6, 96.1, 77.2, 56.4, 56.3, 56.6, 59.0, 60.2, 62.9, 66.0, 62.0, 73.7, 77.5, 85.2, 85.3, 88.5, 87.6, 93.9]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 102.0, 104.0, 109.0, 118.1, 112.6, 99.0, 79.5, 58.0, 55.1, 55.8, 61.2, 59.6, 66.7, 63.3, 57.8, 67.3, 78.4, 82.3, 79.5, 80.5, 89.4, 90.7]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 102.1, 100.1, 102.1, 108.5, 111.0, 100.8, 82.6, 59.3, 61.5, 58.0, 62.8, 63.8, 66.7, 69.6, 65.5, 77.1, 82.3, 89.0, 87.3, 91.9, 93.3, 97.6]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 97.1, 101.1, 99.4, 100.2, 103.9, 102.8, 87.1, 67.5, 62.2, 58.7, 61.9, 66.7, 66.4, 69.5, 70.8, 85.2, 89.1, 99.0, 95.5, 108.6, 104.1, 101.0]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 93.7, 93.3, 93.8, 99.8, 102.2, 91.9, 76.9, 59.7, 63.8, 52.9, 56.0, 62.8, 61.1, 67.7, 61.5, 72.6, 83.5, 82.2, 78.1, 86.1, 92.7, 98.2]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 94.0, 96.4, 99.0, 102.1, 115.0, 98.7, 77.0, 58.5, 57.6, 63.8, 65.9, 64.5, 65.5, 77.7, 66.3, 73.4, 81.4, 91.1, 83.3, 90.8, 91.0, 100.0]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 104.7, 99.5, 103.6, 108.4, 113.7, 102.8, 83.0, 58.5, 62.7, 59.1, 64.8, 65.1, 67.0, 70.0, 66.7, 78.3, 82.4, 89.8, 86.8, 92.2, 94.3, 98.2]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 105.0, 101.7, 104.4, 120.5, 113.2, 102.6, 89.9, 62.7, 64.7, 59.6, 65.1, 65.4, 71.8, 74.8, 72.1, 85.2, 88.8, 96.2, 97.6, 101.2, 101.4, 105.7]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 101.7, 97.9, 101.1, 106.1, 111.0, 100.0, 81.3, 58.8, 62.8, 57.8, 62.7, 64.5, 65.5, 69.7, 65.4, 76.8, 82.6, 88.0, 84.6, 90.7, 93.8, 98.2]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 96.9, 98.1, 99.6, 105.6, 105.7, 96.1, 79.6, 60.6, 60.8, 54.9, 58.7, 62.5, 63.8, 66.6, 62.1, 73.2, 82.9, 85.3, 81.7, 88.5, 93.8, 96.4]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 110.5, 108.6, 102.3, 104.3, 114.1, 144.0, 154.7, 112.4, 124.5, 117.3, 115.4, 117.4, 121.5, 122.0, 112.7, 118.4, 116.5, 127.9, 120.8, 121.6, 114.5, 130.6]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 106.6, 109.7, 97.7, 97.7, 112.7, 125.2, 135.0, 100.1, 109.8, 107.0, 112.6, 104.0, 108.1, 104.7, 109.6, 109.7, 111.2, 124.7, 111.3, 117.5, 111.0, 126.7]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 110.7, 106.4, 101.5, 102.8, 112.9, 139.7, 147.3, 107.8, 116.7, 113.3, 111.3, 110.5, 115.4, 113.9, 109.5, 117.0, 115.0, 124.4, 118.1, 120.4, 112.3, 127.6]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 108.6, 103.8, 102.1, 105.0, 115.4, 144.3, 163.1, 109.7, 117.3, 115.8, 113.2, 115.6, 117.0, 113.5, 108.1, 114.0, 112.3, 115.9, 107.2, 109.8, 107.1, 128.9]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 108.9, 104.3, 101.8, 104.7, 115.1, 143.4, 159.1, 108.9, 116.8, 114.7, 112.3, 114.0, 116.5, 113.4, 108.5, 114.7, 112.6, 118.0, 109.6, 113.1, 108.6, 128.9]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 101.1, 98.8, 103.9, 104.5, 119.2, 140.0, 156.4, 109.9, 114.3, 113.4, 111.8, 110.4, 117.2, 114.5, 104.1, 113.4, 109.1, 110.9, 107.5, 112.0, 103.2, 124.1]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 109.6, 104.4, 102.2, 105.1, 113.6, 146.3, 163.9, 110.9, 117.0, 117.6, 111.5, 113.6, 115.8, 111.0, 104.6, 113.5, 110.2, 113.3, 106.8, 108.8, 107.3, 128.5]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 108.7, 105.2, 100.7, 104.3, 115.9, 136.4, 152.3, 105.3, 113.3, 109.4, 109.9, 110.8, 115.2, 112.2, 112.9, 113.2, 112.8, 120.7, 110.5, 117.2, 111.0, 130.3]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 112.4, 102.4, 101.8, 102.6, 111.4, 139.4, 142.2, 104.8, 109.4, 110.4, 105.6, 104.0, 110.3, 106.9, 105.5, 117.8, 114.3, 119.7, 117.2, 119.7, 109.9, 124.2]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 107.1, 99.1, 96.9, 104.8, 118.3, 137.0, 158.0, 101.9, 110.6, 109.5, 108.1, 114.1, 112.7, 110.0, 97.6, 114.1, 110.8, 120.2, 101.8, 110.3, 107.1, 131.0]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 107.4, 103.6, 100.4, 105.8, 117.5, 144.1, 156.0, 105.7, 114.5, 111.3, 109.0, 110.4, 115.4, 112.3, 108.8, 114.5, 110.4, 119.7, 108.7, 119.3, 110.7, 131.2]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 108.4, 104.9, 100.2, 106.2, 117.2, 145.6, 155.7, 105.5, 115.0, 111.1, 108.6, 110.0, 115.4, 112.2, 110.9, 114.8, 110.6, 121.1, 109.7, 121.6, 112.4, 132.4]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 107.5, 103.3, 102.1, 105.2, 116.6, 146.9, 165.3, 109.8, 118.8, 116.6, 115.4, 117.8, 117.8, 115.1, 108.6, 114.8, 113.0, 116.8, 106.5, 109.6, 106.3, 129.1]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 109.6, 104.3, 102.0, 104.2, 115.5, 130.5, 153.9, 106.7, 112.5, 108.3, 110.4, 113.4, 117.0, 114.4, 115.7, 112.7, 115.5, 119.2, 111.0, 112.9, 109.6, 129.2]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 107.9, 104.3, 102.2, 105.0, 116.2, 146.0, 162.7, 110.3, 119.9, 116.6, 115.2, 117.4, 118.6, 116.6, 109.3, 115.5, 113.6, 119.0, 109.6, 112.3, 108.0, 129.2]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 110.2, 103.7, 101.9, 104.5, 113.3, 144.4, 158.7, 109.2, 115.0, 115.7, 110.0, 111.4, 114.5, 110.0, 104.6, 114.5, 111.2, 115.0, 109.0, 111.4, 107.9, 127.6]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 110.2, 109.4, 101.5, 112.7, 124.8, 136.5, 132.2, 102.7, 113.5, 111.9, 115.7, 120.5, 124.5, 118.5, 109.1, 127.1, 123.0, 124.4, 119.3, 117.6, 117.5, 118.3]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 107.7, 109.2, 101.8, 112.8, 123.9, 136.5, 134.9, 106.5, 118.0, 113.3, 122.0, 126.9, 129.2, 123.3, 112.5, 127.9, 125.2, 123.8, 121.3, 119.2, 118.8, 122.5]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 109.1, 113.4, 106.7, 123.4, 138.1, 145.4, 140.5, 110.4, 119.9, 122.3, 139.7, 150.2, 149.1, 141.5, 125.1, 143.2, 133.8, 132.5, 129.8, 129.9, 123.5, 131.3]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 106.0, 111.0, 102.4, 119.4, 132.0, 144.5, 137.8, 106.7, 118.3, 118.3, 129.1, 137.6, 143.9, 137.0, 120.3, 137.8, 130.5, 126.0, 129.6, 132.4, 125.1, 128.6]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 113.7, 120.7, 105.3, 129.0, 138.1, 153.4, 153.2, 115.4, 123.3, 124.1, 152.6, 147.8, 150.9, 150.7, 123.7, 145.2, 136.1, 131.5, 139.1, 133.0, 126.1, 134.4]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 111.0, 117.1, 110.2, 116.6, 133.4, 139.2, 146.3, 120.9, 124.0, 118.4, 147.3, 155.8, 158.8, 155.5, 142.6, 156.2, 147.3, 141.9, 143.8, 142.7, 138.8, 142.8]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 105.7, 107.7, 100.1, 113.4, 123.0, 137.3, 135.5, 106.6, 120.6, 111.8, 123.2, 129.6, 130.2, 124.6, 111.9, 126.6, 125.3, 121.7, 117.5, 118.6, 117.8, 121.6]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 108.6, 112.6, 105.4, 121.7, 135.3, 144.2, 140.0, 109.9, 120.1, 120.4, 137.0, 146.3, 145.6, 138.7, 122.6, 140.1, 132.3, 130.5, 127.8, 127.9, 122.5, 129.6]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 107.8, 111.8, 104.8, 118.9, 132.6, 142.0, 139.1, 110.1, 119.3, 119.2, 134.3, 142.1, 143.0, 136.8, 121.6, 139.3, 131.3, 129.3, 127.5, 128.1, 122.6, 129.4]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 107.9, 113.9, 108.5, 111.2, 124.5, 133.6, 139.9, 115.9, 121.0, 122.1, 134.8, 134.8, 138.2, 131.4, 123.4, 134.3, 130.5, 128.9, 139.3, 125.4, 125.5, 136.1]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 108.6, 114.3, 106.9, 117.2, 131.9, 140.7, 142.1, 114.5, 121.4, 118.7, 138.5, 146.1, 150.5, 145.3, 131.4, 146.3, 138.6, 134.0, 137.6, 136.6, 131.8, 136.2]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 108.0, 112.3, 105.9, 120.0, 134.6, 142.8, 140.1, 111.3, 119.6, 120.7, 137.5, 146.2, 146.2, 139.7, 123.8, 142.1, 132.9, 131.1, 128.6, 129.7, 123.1, 131.1]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 106.2, 108.9, 102.6, 116.4, 129.5, 140.0, 135.8, 107.1, 116.7, 117.9, 127.6, 133.7, 134.1, 128.2, 113.2, 133.3, 124.7, 124.3, 119.9, 122.4, 116.1, 124.1]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 107.1, 112.4, 103.2, 121.0, 133.4, 145.3, 139.6, 108.1, 119.3, 119.0, 133.2, 139.9, 144.2, 139.1, 121.5, 139.2, 130.5, 126.6, 130.0, 131.4, 124.7, 129.4]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 105.1, 108.6, 102.8, 117.0, 130.2, 140.8, 136.7, 108.1, 117.3, 119.5, 130.1, 136.5, 136.4, 130.1, 113.5, 134.4, 125.2, 124.3, 120.1, 123.7, 115.6, 125.4]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 107.5, 112.4, 106.6, 124.2, 139.2, 141.5, 136.5, 110.7, 122.3, 118.3, 141.7, 148.7, 137.5, 141.0, 129.7, 143.0, 122.7, 125.4, 120.2, 120.5, 119.7, 129.7]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 115.1, 109.8, 110.8, 110.1, 129.4, 110.9, 75.5, 35.7, 38.1, 30.6, 33.3, 35.5, 39.0, 45.1, 45.4, 64.3, 66.1, 87.2, 85.7, 90.7, 94.9, 112.9]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 117.4, 113.2, 105.8, 106.5, 131.6, 113.0, 77.9, 32.4, 35.1, 27.4, 29.7, 32.3, 37.5, 44.2, 46.4, 66.9, 66.9, 93.2, 91.8, 94.0, 103.4, 120.3]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 113.9, 110.7, 103.4, 105.5, 123.7, 112.3, 76.3, 32.9, 32.1, 27.7, 29.5, 31.3, 35.4, 43.6, 45.1, 65.7, 63.7, 86.2, 81.8, 86.1, 91.4, 107.5]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 116.5, 111.2, 112.4, 111.1, 132.3, 112.9, 77.8, 34.4, 37.3, 30.5, 32.6, 36.7, 39.4, 45.8, 46.6, 64.9, 68.4, 89.6, 88.4, 94.4, 99.2, 117.5]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 110.4, 98.1, 106.8, 105.8, 119.1, 101.8, 58.0, 54.5, 46.0, 35.1, 46.2, 30.5, 41.6, 41.1, 33.2, 64.0, 54.6, 66.2, 74.3, 69.3, 67.9, 86.9]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 108.9, 101.1, 108.7, 109.0, 118.8, 99.3, 62.3, 45.6, 48.1, 34.2, 40.3, 32.4, 40.2, 42.7, 39.2, 59.9, 56.0, 75.4, 74.6, 74.9, 74.5, 93.1]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 110.6, 114.0, 118.8, 105.8, 125.6, 101.2, 73.9, 30.4, 46.8, 29.1, 29.6, 33.2, 35.5, 49.2, 50.5, 57.7, 59.2, 90.8, 86.6, 86.0, 92.0, 108.0]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 100.9, 105.7, 103.1, 105.3, 109.3, 119.0, 74.4, 27.6, 50.9, 36.3, 37.4, 40.5, 32.2, 54.8, 47.6, 78.5, 54.8, 81.0, 82.2, 72.4, 83.9, 96.4]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 118.6, 114.0, 106.5, 107.0, 137.7, 115.4, 79.4, 32.3, 37.9, 27.7, 30.2, 33.8, 39.4, 45.2, 47.4, 69.2, 69.3, 98.9, 100.0, 100.9, 113.2, 132.6]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 106.0, 101.0, 108.0, 115.0, 116.0, 94.8, 64.7, 37.8, 51.7, 34.7, 35.3, 35.1, 39.8, 42.9, 44.3, 54.6, 56.9, 83.7, 70.9, 79.3, 78.1, 97.1]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 118.1, 112.4, 115.2, 111.2, 133.2, 112.7, 75.6, 33.8, 35.0, 29.6, 31.6, 34.8, 37.8, 46.8, 44.5, 60.9, 67.8, 85.1, 83.8, 92.4, 95.7, 114.4]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 116.9, 112.1, 102.8, 106.0, 124.7, 111.9, 76.5, 32.8, 29.5, 26.7, 29.1, 30.2, 35.4, 42.1, 44.4, 65.6, 65.0, 86.0, 82.0, 86.3, 92.6, 106.4]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 101.5, 104.8, 107.5, 102.3, 125.4, 110.4, 75.6, 36.5, 37.8, 29.3, 27.3, 33.0, 37.2, 46.8, 47.7, 58.4, 60.0, 90.5, 80.5, 93.3, 88.1, 120.9]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 116.4, 110.0, 113.6, 110.1, 130.8, 111.0, 73.0, 37.0, 36.7, 30.4, 33.6, 34.1, 38.4, 45.9, 42.9, 61.3, 65.6, 82.5, 82.3, 89.0, 91.3, 110.5]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 112.5, 107.5, 111.2, 113.4, 127.6, 111.6, 80.8, 36.7, 41.1, 33.8, 35.9, 42.0, 42.3, 44.4, 49.9, 69.4, 68.9, 92.0, 89.6, 94.0, 97.0, 113.9]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 111.0, 106.3, 110.4, 113.4, 125.0, 109.0, 77.8, 36.6, 43.2, 34.0, 35.9, 40.7, 41.5, 44.5, 48.9, 67.1, 66.3, 90.2, 86.1, 90.7, 93.3, 110.4]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 109.6, 102.5, 110.4, 110.3, 122.1, 107.8, 79.4, 54.1, 61.5, 54.5, 61.1, 66.5, 72.4, 74.7, 70.4, 81.3, 84.7, 97.5, 93.7, 100.6, 97.0, 106.6]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 107.5, 104.6, 107.2, 112.4, 125.7, 111.8, 84.0, 68.2, 65.3, 51.5, 64.1, 75.9, 73.7, 76.5, 70.8, 77.6, 82.5, 100.5, 91.7, 98.4, 93.4, 110.2]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 107.8, 103.6, 112.1, 112.5, 122.0, 107.3, 79.8, 55.0, 65.8, 60.2, 66.4, 68.3, 75.8, 76.5, 73.6, 82.5, 83.8, 93.2, 92.6, 95.3, 93.5, 101.0]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 108.2, 103.1, 111.4, 112.2, 122.9, 109.3, 83.0, 57.5, 67.3, 62.4, 69.5, 71.9, 78.2, 81.1, 76.6, 85.8, 87.8, 97.1, 95.6, 99.4, 95.9, 104.9]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 111.1, 104.0, 111.3, 110.8, 123.4, 105.9, 77.5, 54.0, 61.1, 55.2, 60.5, 65.8, 69.3, 72.0, 67.0, 78.9, 81.6, 93.9, 90.0, 93.3, 93.2, 104.5]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 110.4, 102.0, 110.2, 111.1, 124.5, 110.2, 82.8, 54.7, 63.7, 55.8, 62.4, 69.3, 78.0, 79.6, 75.1, 85.4, 90.4, 103.1, 99.9, 107.4, 102.5, 112.4]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 106.2, 103.8, 113.5, 111.8, 117.6, 99.7, 70.9, 48.2, 60.9, 54.3, 57.7, 58.2, 68.2, 63.5, 64.3, 72.4, 72.2, 82.2, 83.5, 83.5, 85.8, 90.4]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 114.1, 113.2, 114.9, 127.1, 143.5, 131.0, 87.5, 58.7, 76.7, 64.6, 75.5, 79.7, 90.6, 88.4, 92.5, 100.3, 97.5, 105.1, 107.8, 108.9, 110.4, 110.5]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 110.3, 103.6, 111.7, 113.5, 125.2, 109.2, 80.8, 55.4, 66.5, 58.8, 66.2, 70.1, 76.8, 79.0, 72.8, 83.3, 85.7, 98.5, 93.7, 98.9, 96.0, 106.4]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 107.0, 105.7, 111.7, 110.7, 116.1, 100.1, 71.0, 50.7, 58.3, 49.8, 55.1, 55.7, 65.0, 62.8, 59.6, 69.3, 70.7, 83.1, 82.6, 84.7, 83.1, 94.3]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 110.8, 104.7, 111.0, 112.1, 125.1, 108.4, 79.0, 56.1, 62.8, 55.4, 62.0, 68.0, 71.3, 73.7, 69.3, 80.2, 82.8, 95.5, 91.5, 95.1, 94.5, 105.7]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 103.6, 100.1, 109.0, 107.2, 112.3, 105.0, 74.5, 52.6, 56.4, 49.1, 58.7, 60.4, 64.2, 67.4, 65.4, 75.2, 76.1, 90.5, 84.9, 98.8, 90.5, 94.8]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 111.5, 104.4, 112.5, 115.1, 126.7, 108.7, 78.7, 54.3, 66.9, 57.7, 65.6, 69.3, 75.5, 77.5, 69.7, 81.1, 82.7, 97.7, 90.4, 95.7, 93.7, 105.2]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 108.5, 108.5, 111.5, 111.0, 116.3, 98.9, 70.0, 51.5, 57.4, 47.4, 52.5, 52.8, 63.4, 61.1, 55.1, 65.8, 68.3, 81.5, 81.4, 81.1, 79.4, 96.5]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 110.5, 105.6, 112.0, 113.9, 123.7, 106.0, 76.4, 53.9, 64.2, 54.5, 61.8, 64.9, 72.0, 72.8, 65.6, 76.6, 78.6, 93.1, 87.9, 91.6, 89.6, 102.9]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 109.5, 104.2, 111.6, 112.6, 122.9, 106.8, 78.1, 54.3, 64.0, 56.1, 62.9, 66.2, 73.2, 74.3, 69.0, 79.4, 81.6, 94.2, 90.7, 94.9, 92.5, 103.3]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 95.3, 108.3, 90.3, 112.3, 89.8, 83.8, 44.3, 21.7, 10.4, 12.0, 13.2, 32.5, 9.8, 13.6, 19.4, 18.7, 18.3, 31.3, 29.4, 39.6, 112.9, 27.0]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 104.3, 104.3, 101.3, 107.5, 94.7, 76.5, 43.6, 15.9, 15.0, 11.8, 14.7, 13.7, 15.4, 16.7, 19.1, 23.0, 22.3, 28.6, 29.9, 35.1, 38.6, 34.6]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 95.1, 76.2, 98.6, 89.4, 70.6, 55.9, 25.8, 13.6, 12.0, 7.8, 11.4, 11.3, 10.2, 11.4, 12.1, 12.9, 15.6, 21.1, 20.7, 18.6, 27.4, 16.9]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 80.6, 89.6, 87.1, 92.4, 88.0, 77.7, 45.1, 19.1, 11.7, 11.0, 11.2, 14.1, 12.0, 16.8, 17.0, 19.1, 20.7, 28.6, 29.2, 35.7, 39.5, 20.5]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 97.8, 97.2, 100.1, 100.3, 90.8, 80.1, 42.6, 18.8, 15.5, 11.3, 15.1, 14.9, 14.6, 16.4, 17.0, 21.8, 22.5, 27.1, 32.0, 33.3, 35.0, 27.3]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 101.5, 99.9, 109.6, 112.5, 98.6, 105.8, 70.3, 27.8, 18.7, 12.5, 21.9, 22.2, 23.8, 23.8, 26.0, 30.8, 33.3, 36.7, 51.2, 50.9, 51.2, 37.9]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 90.7, 94.6, 94.5, 101.1, 91.8, 87.9, 56.9, 24.5, 14.7, 12.6, 15.9, 15.5, 17.2, 19.2, 20.1, 25.6, 26.0, 31.4, 38.1, 41.3, 38.1, 27.9]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 94.2, 94.9, 95.6, 94.3, 76.4, 66.9, 32.4, 12.8, 18.4, 10.1, 19.0, 13.0, 11.6, 13.4, 14.2, 17.5, 20.3, 20.1, 26.7, 30.3, 24.9, 24.3]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 95.4, 89.6, 95.7, 94.5, 75.5, 64.3, 33.1, 15.3, 15.8, 10.2, 16.2, 12.4, 12.0, 13.0, 14.0, 17.7, 19.2, 21.4, 25.4, 27.4, 26.5, 22.6]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 73.4, 79.3, 96.9, 94.9, 76.7, 57.2, 33.6, 15.1, 9.6, 9.8, 3.7, 13.1, 23.6, 24.4, 24.3, 22.3, 22.0, 29.8, 17.4, 42.2, 20.2, 21.2]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 103.7, 103.9, 106.2, 105.9, 101.1, 90.5, 47.9, 21.0, 16.3, 12.0, 15.5, 16.7, 16.8, 18.5, 18.9, 25.0, 25.0, 30.3, 36.9, 36.3, 39.2, 31.8]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 79.1, 87.8, 86.0, 89.5, 88.5, 78.3, 46.0, 19.1, 12.0, 10.9, 11.5, 11.6, 11.5, 16.7, 16.1, 19.0, 20.9, 28.1, 30.0, 34.7, 30.7, 19.6]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 102.4, 103.8, 86.9, 111.5, 86.3, 77.1, 60.2, 33.8, 13.9, 18.5, 16.3, 12.5, 19.6, 16.3, 19.1, 34.2, 25.2, 29.3, 33.1, 40.4, 31.5, 31.3]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 103.9, 104.8, 107.9, 103.2, 105.2, 93.8, 44.1, 21.8, 16.4, 11.9, 14.1, 16.8, 15.6, 17.9, 16.9, 24.4, 24.2, 29.4, 36.6, 33.0, 36.3, 28.7]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 100.0, 101.2, 102.8, 100.2, 94.0, 83.4, 39.7, 18.4, 17.0, 11.2, 15.9, 15.9, 13.9, 16.1, 16.0, 21.7, 22.5, 26.0, 32.7, 32.1, 34.4, 27.0]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 99.8, 92.3, 100.1, 99.9, 84.5, 67.7, 36.2, 14.9, 13.7, 10.1, 13.1, 12.7, 13.6, 14.8, 16.5, 18.9, 19.6, 25.6, 25.9, 28.6, 33.6, 27.1]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 126.8, 55.2, 59.5, 81.5, 111.1, 73.7, 73.0, 37.8, 43.5, 38.8, 29.7, 34.5, 35.0, 106.0, 64.9, 44.3, 83.6, 45.7, 110.6, 93.6, 114.3, 105.5]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 102.8, 105.9, 97.7, 116.8, 123.9, 102.9, 89.9, 51.1, 46.2, 31.8, 37.1, 44.8, 56.1, 60.1, 72.9, 76.4, 78.2, 87.0, 95.4, 103.3, 115.3, 125.2]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 115.0, 194.1, 133.5, 173.1, 168.4, 144.9, 131.5, 87.5, 34.4, 52.2, 65.7, 80.8, 126.6, 43.2, 53.1, 77.8, 91.9, 77.9, 122.7, 125.8, 238.8, 181.5]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 146.5, 98.1, 137.6, 146.3, 166.0, 143.2, 154.8, 75.5, 69.2, 28.9, 47.9, 65.3, 109.5, 80.1, 90.3, 81.0, 114.8, 128.0, 106.7, 139.9, 167.7, 157.3]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 116.6, 108.1, 113.8, 124.1, 142.5, 138.7, 92.7, 53.2, 40.2, 44.7, 54.7, 39.4, 60.6, 53.5, 63.5, 71.0, 90.4, 90.6, 93.8, 109.0, 135.6, 119.3]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 112.0, 122.5, 139.9, 154.9, 146.6, 188.8, 116.6, 99.9, 71.4, 55.7, 78.2, 89.5, 109.3, 105.8, 139.5, 127.4, 153.3, 137.0, 145.9, 195.5, 193.2, 195.2]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 113.6, 104.1, 128.7, 124.4, 131.0, 108.5, 89.8, 47.3, 43.6, 31.5, 37.0, 44.8, 49.7, 35.9, 66.2, 67.3, 93.2, 82.9, 81.0, 105.3, 99.7, 112.9]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 115.5, 102.9, 118.0, 122.6, 142.9, 146.2, 89.8, 50.3, 40.6, 44.4, 56.3, 34.2, 54.6, 48.3, 64.8, 73.4, 91.1, 98.1, 87.6, 108.6, 123.9, 112.3]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 93.2, 85.4, 105.4, 104.1, 130.1, 103.9, 81.4, 32.3, 26.4, 24.8, 27.7, 24.4, 45.2, 26.5, 54.1, 40.1, 61.0, 59.7, 62.5, 74.4, 78.4, 73.1]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 109.7, 108.8, 113.2, 125.0, 132.7, 117.6, 94.7, 59.7, 48.7, 34.3, 43.9, 51.2, 60.1, 66.9, 80.7, 80.1, 88.7, 98.1, 97.0, 114.3, 126.6, 138.3]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 109.3, 111.8, 113.4, 123.9, 125.7, 104.9, 89.2, 52.5, 47.4, 33.8, 39.2, 49.0, 53.5, 51.3, 71.6, 78.5, 89.2, 88.0, 93.9, 109.3, 114.1, 128.7]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 123.3, 110.5, 136.6, 132.1, 146.5, 124.9, 97.5, 64.2, 46.6, 32.2, 46.7, 52.0, 52.2, 68.3, 77.4, 72.3, 89.1, 108.2, 84.3, 110.4, 128.1, 146.8]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 121.6, 117.2, 142.4, 134.0, 126.0, 105.9, 84.6, 52.5, 50.6, 36.2, 41.3, 54.8, 43.0, 34.8, 70.2, 82.8, 110.6, 90.7, 88.9, 119.8, 102.6, 131.6]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 111.8, 107.2, 118.2, 124.7, 133.3, 117.2, 92.9, 55.0, 46.1, 34.6, 43.0, 47.8, 56.9, 55.4, 74.1, 75.0, 90.3, 92.4, 91.5, 110.8, 119.1, 128.0]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 111.6, 98.4, 121.2, 119.1, 138.6, 114.5, 90.2, 50.6, 38.5, 29.6, 38.5, 40.4, 48.7, 53.4, 67.8, 58.5, 77.8, 86.6, 76.8, 95.6, 108.0, 116.1]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 119.5, 108.2, 128.0, 136.5, 147.8, 158.9, 108.6, 69.8, 54.8, 45.4, 61.8, 56.4, 80.5, 71.3, 92.1, 91.4, 114.2, 115.0, 108.8, 140.6, 152.5, 145.3]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 106.3, 102.4, 110.3, 100.0, 101.0, 83.6, 34.1, 12.5, 13.8, 11.9, 17.0, 15.8, 13.0, 16.4, 38.3, 24.6, 21.9, 36.5, 36.7, 35.7, 43.8, 47.3]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 106.0, 107.2, 111.0, 114.5, 113.3, 86.1, 44.7, 15.4, 21.7, 15.8, 13.8, 13.0, 17.6, 21.9, 24.4, 27.2, 28.8, 40.1, 37.8, 46.9, 49.2, 58.4]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 105.3, 107.8, 113.5, 112.7, 107.0, 79.6, 37.1, 14.9, 16.8, 13.1, 12.9, 12.6, 14.0, 16.8, 33.7, 24.5, 23.7, 33.7, 32.9, 36.3, 41.6, 50.9]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 94.4, 120.7, 120.1, 107.0, 101.5, 100.9, 52.4, 23.9, 22.9, 16.2, 13.4, 19.0, 18.0, 35.0, 44.4, 31.3, 37.7, 48.4, 44.8, 47.9, 54.0, 61.6]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 105.9, 102.1, 122.5, 125.9, 123.2, 104.7, 54.3, 22.0, 23.4, 16.4, 21.7, 18.7, 21.2, 28.8, 27.5, 39.8, 44.8, 50.9, 58.4, 66.2, 62.8, 71.7]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 104.9, 104.6, 113.1, 111.3, 112.2, 90.5, 46.8, 16.9, 21.3, 15.4, 15.6, 15.6, 17.9, 24.8, 27.6, 30.9, 32.8, 44.2, 42.8, 50.0, 52.4, 62.6]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 105.6, 102.0, 113.5, 113.4, 116.6, 97.8, 53.4, 18.4, 24.7, 17.5, 17.6, 17.4, 21.1, 29.9, 24.8, 35.0, 38.8, 51.1, 50.1, 59.5, 59.6, 69.6]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 101.0, 108.1, 110.7, 99.2, 106.1, 86.3, 42.0, 15.6, 17.3, 11.8, 14.2, 14.9, 13.8, 22.7, 23.7, 29.0, 29.9, 40.7, 36.0, 43.1, 48.1, 61.2]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 106.6, 105.5, 109.0, 109.3, 112.7, 92.1, 50.0, 15.4, 23.9, 17.2, 14.8, 14.9, 19.2, 26.5, 21.9, 29.7, 31.6, 46.0, 43.3, 53.6, 55.7, 61.9]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 86.1, 116.6, 106.9, 134.4, 148.5, 118.0, 30.8, 20.5, 21.1, 14.8, 44.2, 17.2, 29.2, 18.6, 21.8, 22.9, 48.4, 49.4, 37.4, 55.6, 48.2, 70.5]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 106.3, 103.0, 118.6, 115.4, 114.8, 98.0, 46.6, 18.3, 19.6, 14.7, 19.7, 17.8, 18.1, 24.0, 31.5, 34.7, 36.2, 45.6, 49.8, 54.6, 55.8, 62.8]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 106.4, 109.4, 114.7, 122.1, 112.0, 73.6, 36.7, 15.1, 17.9, 13.4, 10.0, 9.5, 14.1, 14.1, 28.9, 23.3, 22.7, 29.5, 28.4, 34.9, 38.1, 51.5]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 101.6, 105.4, 108.1, 95.4, 100.3, 77.7, 42.9, 15.1, 16.8, 11.0, 10.7, 13.6, 11.5, 23.2, 23.7, 27.1, 26.7, 38.7, 35.5, 40.4, 46.6, 58.6]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 115.7, 130.2, 149.8, 94.9, 117.3, 149.1, 47.7, 14.0, 17.9, 17.6, 14.1, 27.9, 19.3, 22.6, 26.4, 61.8, 43.8, 53.6, 40.3, 59.3, 67.5, 80.7]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 100.1, 101.1, 109.8, 97.2, 105.5, 89.5, 52.0, 18.4, 22.7, 15.4, 13.7, 18.4, 18.3, 33.2, 29.0, 33.7, 37.3, 52.1, 43.9, 50.1, 54.6, 72.3]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 100.1, 85.6, 108.0, 95.8, 115.6, 103.7, 66.7, 21.4, 32.2, 22.2, 18.7, 25.8, 29.3, 48.6, 30.9, 45.3, 54.5, 75.4, 57.2, 66.8, 67.9, 99.2]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 83.7, 77.2, 73.8, 113.5, 154.3, 130.3, 216.6, 147.0, 96.6, 106.9, 111.5, 104.6, 87.6, 73.9, 87.6, 94.1, 74.3, 96.6, 104.9, 97.7, 91.4, 93.9]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 115.8, 87.2, 124.5, 138.3, 192.5, 174.1, 223.5, 143.4, 132.0, 86.2, 157.6, 109.5, 79.2, 100.4, 91.3, 91.5, 89.2, 117.5, 113.2, 118.8, 95.2, 100.9]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 89.6, 64.8, 82.5, 146.5, 161.7, 142.3, 103.5, 143.6, 108.3, 67.1, 116.4, 118.6, 127.7, 114.0, 94.9, 112.1, 76.2, 125.2, 116.0, 117.7, 88.2, 118.9]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 162.2, 123.8, 96.8, 150.1, 176.2, 225.2, 262.8, 343.0, 104.9, 80.0, 330.4, 114.8, 85.4, 102.3, 159.9, 175.3, 116.0, 148.5, 160.1, 117.3, 126.8, 147.2]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 127.6, 84.2, 64.8, 153.9, 137.7, 144.7, 148.3, 156.4, 120.9, 136.4, 96.1, 78.4, 77.6, 72.1, 104.1, 122.2, 70.1, 90.6, 104.0, 149.1, 130.6, 128.8]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 96.1, 97.6, 69.9, 111.3, 170.3, 139.3, 151.1, 134.1, 102.6, 65.3, 116.3, 105.6, 105.6, 97.7, 114.6, 104.9, 82.6, 118.8, 119.7, 93.6, 92.2, 113.7]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 115.5, 91.7, 93.3, 146.5, 191.8, 153.7, 195.4, 217.9, 155.0, 86.6, 168.5, 135.6, 126.1, 152.2, 115.1, 104.1, 111.4, 145.1, 157.7, 119.0, 109.7, 119.2]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 96.0, 88.5, 69.2, 116.6, 141.7, 142.6, 189.1, 156.5, 96.3, 95.1, 124.7, 97.7, 86.8, 79.4, 102.5, 99.1, 74.0, 100.5, 104.6, 103.8, 94.8, 105.6]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 92.1, 92.6, 66.2, 165.4, 205.5, 116.8, 388.3, 270.8, 153.5, 58.4, 209.4, 214.4, 188.9, 200.8, 204.5, 86.2, 147.8, 156.8, 151.8, 168.3, 73.4, 172.7]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 102.5, 82.0, 60.4, 138.5, 102.7, 111.7, 128.5, 125.0, 97.6, 152.1, 45.1, 59.5, 69.9, 71.6, 79.3, 99.3, 54.6, 78.7, 72.9, 127.4, 80.5, 93.3]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 107.2, 80.8, 60.1, 142.5, 105.2, 115.9, 100.0, 118.2, 96.6, 116.5, 47.5, 61.8, 59.7, 72.2, 81.8, 89.8, 47.5, 73.0, 74.5, 123.1, 71.4, 97.3]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 102.3, 51.9, 75.2, 134.1, 114.8, 73.3, 395.4, 318.3, 58.9, 689.1, 62.6, 88.7, 160.1, 76.5, 125.7, 59.3, 74.6, 90.2, 79.6, 112.4, 146.4, 82.3]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 121.3, 92.2, 88.2, 145.6, 245.4, 137.9, 181.1, 153.1, 133.7, 82.2, 131.2, 122.4, 120.0, 112.1, 95.9, 138.0, 107.3, 144.1, 152.4, 91.0, 123.8, 116.2]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 108.1, 91.4, 112.9, 148.2, 185.5, 158.6, 238.8, 156.9, 131.8, 81.5, 153.9, 115.8, 96.6, 105.4, 98.4, 86.3, 89.7, 118.2, 112.3, 118.7, 89.5, 102.9]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 124.3, 85.3, 92.0, 132.8, 162.9, 124.7, 173.8, 130.5, 105.8, 97.2, 113.5, 110.6, 83.3, 90.0, 76.4, 79.3, 82.0, 101.8, 112.3, 85.9, 73.7, 80.6]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 228.0, 81.6, 61.1, 228.8, 210.6, 238.3, 358.9, 266.2, 181.9, 241.3, 236.0, 135.6, 105.6, 68.4, 77.5, 95.6, 111.6, 116.2, 142.3, 132.8, 344.6, 167.8]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 106.9, 80.6, 103.3, 142.9, 181.9, 158.7, 176.5, 160.2, 129.1, 79.8, 146.1, 118.5, 106.2, 116.6, 97.9, 101.3, 89.8, 126.3, 124.1, 118.5, 96.1, 111.1]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 101.8, 99.8, 86.6, 120.6, 185.8, 157.6, 114.9, 187.9, 150.3, 104.3, 136.5, 82.4, 116.3, 75.3, 215.3, 271.3, 112.8, 130.7, 175.8, 263.4, 135.1, 207.8]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 60.5, 69.0, 65.1, 93.7, 101.1, 127.6, 231.8, 137.7, 75.7, 102.4, 101.4, 94.4, 65.8, 51.0, 81.4, 69.1, 54.5, 68.5, 77.3, 101.2, 70.3, 81.0]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 97.2, 88.0, 113.8, 134.4, 149.0, 109.9, 151.9, 110.2, 120.2, 55.1, 128.8, 80.4, 103.3, 95.1, 92.4, 82.7, 65.7, 92.1, 82.5, 100.8, 55.3, 112.5]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 178.4, 127.3, 102.5, 191.6, 212.3, 163.1, 233.5, 140.7, 136.7, 107.7, 166.9, 178.9, 126.3, 135.6, 90.4, 86.0, 144.2, 128.7, 174.5, 121.9, 87.3, 104.8]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 117.9, 88.9, 96.3, 135.3, 166.9, 118.1, 168.4, 123.3, 104.7, 83.2, 120.4, 105.9, 87.2, 79.0, 70.2, 82.9, 65.2, 99.5, 99.8, 84.5, 71.7, 77.9]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 122.6, 102.7, 107.7, 156.8, 168.2, 125.6, 181.6, 122.2, 125.2, 72.9, 138.9, 112.8, 113.2, 106.9, 90.2, 82.1, 90.6, 104.0, 112.4, 106.4, 65.9, 107.5]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 93.8, 81.3, 71.4, 115.2, 124.6, 155.9, 247.5, 189.6, 89.5, 107.9, 158.6, 101.6, 72.8, 62.9, 97.4, 93.0, 71.4, 88.5, 99.2, 106.8, 102.0, 101.0]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 112.4, 95.0, 105.1, 148.6, 173.1, 124.0, 158.5, 124.3, 118.2, 64.8, 138.9, 108.3, 109.4, 93.2, 80.1, 92.5, 68.2, 106.7, 102.6, 100.9, 73.1, 98.7]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 53.3, 123.6, 50.6, 99.7, 64.6, 103.6, 179.1, 14.5, 144.6, 23.3, 3.7, 7.5, 92.9, 59.8, 9.0, 237.9, 111.0, 128.3, 50.2, 187.8, 115.2, 61.1]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 50.0, 132.1, 49.8, 226.9, 93.9, 51.7, 222.2, 161.9, 105.0, 61.4, 54.3, 66.1, 164.8, 47.4, 49.7, 34.3, 29.4, 81.9, 59.7, 61.6, 51.8, 43.9]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 110.5, 72.7, 88.9, 114.3, 144.7, 109.6, 153.8, 114.4, 89.8, 95.9, 90.3, 87.8, 64.8, 67.9, 66.7, 73.6, 60.2, 87.7, 88.1, 70.9, 64.5, 68.0]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 97.9, 108.4, 64.7, 101.2, 124.6, 160.5, 168.8, 171.1, 82.6, 54.7, 160.4, 97.5, 90.6, 91.7, 124.4, 94.2, 75.8, 111.8, 104.6, 88.6, 80.5, 110.8]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 74.9, 101.6, 52.8, 82.1, 107.3, 137.9, 131.7, 111.5, 70.9, 46.3, 101.5, 95.0, 92.5, 89.1, 116.1, 55.7, 58.4, 96.7, 85.6, 72.7, 60.8, 99.0]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 127.2, 106.8, 105.8, 157.5, 190.2, 127.7, 176.4, 127.7, 119.6, 69.9, 150.6, 122.1, 108.4, 86.8, 69.0, 93.2, 67.7, 110.5, 110.9, 96.6, 79.6, 85.3]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 116.9, 90.6, 100.5, 142.0, 170.2, 127.9, 173.2, 130.3, 114.5, 80.0, 129.9, 110.1, 97.2, 93.2, 80.5, 86.3, 76.2, 105.8, 107.6, 96.5, 75.1, 91.6]',
    },
  ]

  const randomId$2 = 'industry' + Math.random().toString(16).split('.')[1]
  document.currentScript.setAttribute('data-content-id', randomId$2)

  window.$cardifyScripts.wowMomData = {
    apparel: { wow: -2.7, mom: 21.4 },
    financial: { wow: 40.5, mom: -17.8 },
    grocery: { wow: 0.8, mom: -4.2 },

    travel: { wow: 19.4, mom: 60.0 },
    restaurants: { wow: 15.0, mom: 15.9 },

    gas: { wow: 7.4, mom: 17.4 },
    computer: { wow: -2.6, mom: -8.6 },
    care: { wow: 32.3, mom: 69.9 },
    beauty: { wow: 5.0, mom: -7.5 },
  }

  window.$cardifyScripts = {}

  window.cardify = {
    showChart,
    hideChart,
    CHART_COLORS,
    CHART_HEIGHT,
    simpleLineOptions,
    showPaywall,
    hidePaywall,
    displayPaywall,
    loadCardifyIndustry,
    tooltips: { pelotonCustomTooltip },
    loadScript,
  }

  document.addEventListener('DOMContentLoaded', showChartPreview)
  document.addEventListener('DOMContentLoaded', emailValidationInit)
  document.addEventListener('DOMContentLoaded', momWowRender)
})
