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
    let labels = []
    try {
      labels = JSON.parse(data[0].dates)
    } catch (error) {
      console.log(error)
    }
    console.log('Finished loading data for page ' + industryKey, data)
    window.cardify.showChart('#travel-graph-container', {
      bottomLabels,
      height: 350,
      type: 'line',
      data: {
        labels,
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
  window.$cardifyScripts = window.$cardifyScripts || {}
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
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 94.6, 108.2, 138.2, 104.2, 111.2, 101.8, 62.5, 63.7, 54.9, 54.7, 63.8, 72.9, 74.1, 86.4, 81.6, 85.5, 89.6, 89.8, 98.5, 102.7, 108.7, 113.6, 100.9, 100.3, 96.7, 97.4, 91.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 101.4, 111.2, 119.6, 121.2, 137.5, 117.5, 76.8, 58.3, 61.5, 67.2, 82.6, 81.6, 83.9, 94.0, 93.4, 103.3, 109.4, 112.2, 120.5, 124.2, 117.1, 129.7, 116.4, 123.1, 117.1, 113.8, 107.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 96.4, 113.6, 121.6, 109.4, 116.6, 97.6, 69.3, 62.7, 59.2, 56.4, 72.7, 71.6, 75.3, 85.4, 85.3, 101.5, 106.9, 92.3, 110.5, 106.5, 107.4, 115.2, 112.5, 111.1, 108.7, 102.5, 89.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 105.8, 116.8, 121.3, 119.2, 131.4, 115.9, 76.0, 62.1, 66.3, 69.0, 80.5, 86.4, 88.3, 96.9, 99.0, 109.0, 114.8, 112.1, 125.4, 128.7, 126.1, 134.1, 126.1, 128.1, 124.9, 122.2, 112.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 107.2, 115.0, 112.8, 122.9, 155.6, 117.4, 72.9, 71.8, 71.4, 82.7, 90.5, 96.8, 101.5, 108.7, 105.1, 117.3, 118.5, 127.4, 120.0, 132.9, 130.2, 135.3, 124.0, 130.6, 129.4, 126.0, 114.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 108.2, 114.1, 121.1, 121.7, 134.7, 119.8, 76.9, 61.3, 68.8, 72.1, 83.3, 89.6, 91.3, 100.2, 101.3, 112.2, 118.5, 116.5, 130.7, 133.8, 128.8, 136.7, 129.3, 131.0, 128.5, 124.3, 116.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 104.4, 138.1, 118.4, 123.5, 136.6, 115.7, 81.9, 64.5, 66.0, 71.4, 80.0, 87.7, 86.8, 95.4, 104.7, 107.3, 110.5, 110.3, 120.1, 126.1, 129.0, 138.0, 124.1, 132.5, 124.5, 132.0, 116.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 100.0, 110.3, 123.4, 117.9, 132.1, 114.0, 73.5, 60.1, 60.0, 64.9, 79.0, 80.0, 81.9, 92.4, 91.3, 99.8, 105.6, 107.9, 115.9, 119.9, 115.5, 127.1, 113.1, 118.8, 113.8, 111.3, 104.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 103.8, 112.8, 110.9, 95.5, 108.6, 105.7, 71.6, 64.0, 50.4, 49.0, 70.6, 72.0, 87.4, 79.2, 91.2, 102.6, 111.9, 113.0, 114.3, 131.6, 136.9, 148.0, 140.0, 138.3, 138.8, 130.3, 113.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 104.2, 143.6, 118.9, 123.3, 134.2, 116.1, 84.4, 62.3, 66.0, 69.7, 78.0, 86.5, 85.1, 93.8, 105.0, 106.1, 109.0, 107.5, 120.5, 125.3, 129.5, 137.4, 124.9, 132.7, 122.6, 132.2, 117.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 101.1, 102.1, 121.1, 127.1, 135.7, 106.7, 62.8, 83.2, 56.1, 73.3, 88.8, 86.9, 83.4, 93.2, 100.5, 106.1, 117.6, 118.8, 114.7, 123.2, 120.5, 151.0, 112.5, 131.9, 144.2, 140.5, 108.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 97.2, 111.9, 124.5, 105.4, 113.5, 100.3, 67.7, 63.3, 56.4, 54.5, 69.7, 72.0, 77.1, 84.6, 85.3, 97.0, 102.8, 95.3, 107.7, 109.9, 113.1, 120.7, 114.1, 112.8, 110.6, 106.1, 94.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 111.2, 114.6, 119.4, 115.2, 125.5, 122.3, 74.6, 57.9, 66.1, 71.9, 78.8, 87.5, 91.2, 102.7, 109.5, 124.6, 142.2, 129.1, 151.6, 152.2, 152.6, 158.8, 149.9, 151.0, 146.6, 144.5, 131.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 110.5, 115.4, 122.5, 124.6, 136.9, 120.0, 77.8, 64.3, 73.6, 74.8, 85.3, 94.6, 95.0, 102.5, 102.1, 112.0, 114.0, 113.7, 127.7, 131.4, 125.4, 131.6, 127.9, 127.3, 127.2, 121.8, 115.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 107.7, 115.1, 122.0, 121.7, 133.6, 115.6, 76.1, 64.2, 70.8, 71.5, 83.1, 90.3, 91.5, 99.4, 99.0, 110.1, 112.8, 110.0, 124.2, 126.7, 122.1, 128.6, 124.8, 124.3, 123.7, 118.3, 110.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Apparel & Accessories',
      category: 'Apparel & Accessories',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 107.8, 125.4, 118.3, 116.2, 127.0, 118.1, 78.0, 60.2, 64.4, 68.6, 77.6, 85.4, 88.5, 96.7, 105.8, 115.1, 126.3, 119.1, 135.7, 139.7, 142.1, 149.5, 139.3, 142.7, 136.6, 138.3, 124.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 176.2, 121.2, 118.4, 146.2, 128.2, 105.2, 80.1, 53.4, 69.7, 73.5, 80.8, 111.4, 84.7, 119.1, 95.6, 117.5, 122.6, 132.4, 125.2, 152.7, 133.0, 135.7, 159.7, 128.4, 103.9, 111.7, 137.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 136.5, 106.9, 117.5, 126.6, 142.4, 103.6, 80.5, 64.0, 96.8, 63.8, 92.1, 123.5, 135.5, 163.5, 110.0, 123.5, 119.9, 127.4, 92.6, 99.3, 101.6, 134.6, 95.9, 95.8, 101.0, 100.6, 129.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 132.4, 105.9, 111.9, 120.6, 134.9, 102.2, 78.8, 62.0, 93.7, 63.1, 88.2, 125.5, 135.4, 157.0, 109.5, 122.6, 109.3, 122.8, 83.7, 95.0, 94.4, 119.1, 89.4, 92.7, 95.7, 94.9, 121.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 135.1, 107.0, 118.5, 127.4, 140.4, 103.4, 80.0, 66.8, 98.3, 65.0, 95.0, 136.5, 144.8, 173.6, 114.4, 123.3, 118.6, 122.2, 86.9, 94.2, 99.1, 132.0, 94.3, 96.1, 99.0, 101.3, 129.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 126.9, 100.4, 109.3, 125.5, 139.2, 104.5, 77.6, 58.0, 88.7, 60.6, 90.6, 113.9, 128.9, 148.9, 111.9, 125.4, 118.8, 134.0, 98.8, 105.7, 106.3, 146.6, 103.4, 104.3, 109.3, 105.8, 131.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 147.2, 111.4, 124.7, 128.2, 153.7, 102.3, 84.9, 64.8, 103.5, 63.7, 89.7, 104.0, 122.9, 159.7, 100.6, 122.2, 128.9, 136.0, 101.5, 103.9, 104.9, 138.9, 93.6, 87.9, 100.1, 97.1, 132.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 132.3, 106.6, 111.3, 119.8, 133.6, 105.6, 78.0, 60.7, 92.4, 62.6, 87.9, 123.7, 137.2, 155.9, 108.3, 124.6, 108.2, 120.7, 84.7, 95.7, 94.1, 116.7, 88.0, 92.9, 97.6, 94.3, 123.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 129.0, 102.1, 95.2, 115.1, 110.6, 111.5, 76.5, 51.1, 79.1, 68.4, 90.1, 88.3, 111.1, 118.8, 98.4, 93.3, 96.5, 102.6, 98.2, 92.5, 88.7, 108.9, 98.8, 96.3, 97.1, 87.7, 96.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 158.5, 110.0, 119.8, 126.0, 210.5, 114.4, 80.5, 67.4, 98.7, 63.0, 79.1, 82.2, 98.9, 115.9, 97.5, 108.0, 121.5, 116.4, 88.2, 105.9, 107.9, 147.3, 94.2, 87.3, 121.4, 90.8, 98.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 135.8, 107.6, 121.1, 128.2, 143.2, 103.4, 80.5, 68.2, 99.9, 64.7, 95.6, 141.1, 148.4, 178.7, 115.9, 126.2, 121.0, 124.4, 86.0, 94.8, 100.3, 134.0, 93.7, 96.0, 99.5, 102.8, 132.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 145.6, 107.5, 106.6, 123.4, 144.8, 111.4, 78.4, 56.6, 83.8, 67.5, 85.2, 90.0, 103.2, 117.9, 97.7, 101.7, 108.4, 111.6, 99.3, 106.1, 101.6, 125.1, 106.8, 98.4, 105.8, 92.4, 103.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 130.7, 103.4, 110.4, 124.3, 136.8, 104.9, 77.8, 58.7, 89.3, 61.8, 89.3, 117.2, 130.1, 150.2, 110.0, 124.8, 115.2, 129.3, 94.9, 104.0, 103.1, 135.7, 100.3, 101.3, 105.0, 102.0, 128.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 131.6, 104.0, 107.4, 134.5, 141.7, 83.5, 73.1, 69.9, 102.3, 67.5, 91.6, 134.0, 131.8, 174.0, 114.3, 120.9, 107.1, 113.6, 80.3, 82.5, 92.2, 135.1, 99.0, 100.1, 89.5, 95.4, 118.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 135.4, 100.6, 127.3, 105.9, 139.1, 94.9, 98.1, 63.8, 93.7, 61.4, 85.9, 132.2, 119.6, 140.0, 115.9, 100.7, 126.9, 165.6, 77.5, 109.9, 102.6, 119.7, 89.5, 76.2, 82.8, 101.5, 105.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 146.3, 112.0, 125.2, 129.5, 147.5, 101.2, 84.9, 64.5, 104.5, 63.8, 91.1, 105.4, 125.9, 165.8, 100.4, 124.8, 129.8, 137.1, 104.1, 103.4, 104.7, 138.7, 93.8, 88.5, 98.3, 97.7, 137.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Beauty Products',
      category: 'Beauty Products',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 136.3, 107.0, 119.4, 127.9, 143.3, 103.1, 80.9, 65.0, 98.5, 63.5, 93.4, 126.3, 138.5, 168.8, 111.2, 125.7, 122.7, 129.7, 93.3, 99.4, 102.7, 138.0, 96.0, 96.1, 101.4, 102.2, 133.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 98.5, 110.0, 102.3, 109.4, 134.7, 115.2, 141.0, 114.3, 134.8, 130.9, 159.9, 182.0, 160.2, 155.3, 147.7, 145.2, 130.8, 156.2, 133.4, 172.7, 136.1, 112.5, 92.3, 116.5, 108.9, 121.8, 116.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 123.4, 118.8, 120.6, 126.6, 126.7, 122.4, 136.3, 145.5, 143.9, 147.8, 182.1, 210.5, 183.4, 188.0, 201.0, 208.8, 191.1, 182.0, 190.4, 197.0, 180.7, 162.8, 184.5, 158.0, 167.9, 143.5, 135.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 114.9, 113.3, 116.5, 130.1, 141.2, 123.4, 134.6, 128.5, 138.3, 137.5, 180.6, 186.4, 170.0, 171.5, 162.4, 165.9, 156.3, 151.6, 149.3, 166.1, 141.3, 130.3, 125.0, 114.5, 122.4, 112.8, 111.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 106.5, 108.3, 107.1, 107.6, 119.7, 112.9, 130.2, 122.2, 121.6, 122.8, 156.0, 168.5, 158.3, 162.8, 157.0, 165.4, 148.9, 152.6, 151.2, 165.9, 142.4, 135.6, 141.3, 124.2, 122.9, 115.7, 109.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 106.0, 109.8, 115.1, 129.3, 130.2, 118.3, 124.8, 118.0, 125.3, 131.6, 154.7, 168.6, 152.1, 160.7, 164.5, 165.2, 150.8, 162.6, 153.5, 170.7, 139.0, 137.6, 127.0, 125.4, 116.8, 140.1, 114.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 111.6, 112.8, 114.8, 126.5, 126.9, 117.7, 125.3, 128.8, 132.2, 135.4, 163.8, 182.3, 165.4, 173.4, 172.1, 176.8, 165.8, 167.4, 166.6, 174.9, 162.7, 140.9, 144.3, 136.6, 133.4, 136.1, 126.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 99.7, 101.9, 100.5, 96.5, 105.7, 98.6, 135.7, 108.6, 105.4, 104.5, 131.1, 136.6, 148.2, 139.1, 128.1, 141.1, 128.7, 138.4, 136.3, 147.0, 121.0, 116.2, 122.2, 117.6, 111.8, 97.8, 91.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 121.8, 116.4, 123.1, 143.9, 150.3, 127.1, 139.6, 133.3, 147.1, 145.3, 192.8, 195.2, 179.0, 174.9, 166.4, 168.9, 164.2, 152.6, 152.9, 166.5, 142.4, 128.2, 121.2, 114.2, 128.8, 111.0, 112.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 108.1, 109.8, 120.6, 133.8, 129.1, 115.9, 124.2, 120.4, 125.6, 132.2, 155.6, 167.3, 151.9, 160.9, 171.6, 169.2, 156.7, 167.4, 160.1, 171.8, 143.0, 145.8, 135.1, 127.9, 120.2, 146.2, 117.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 108.8, 112.2, 108.1, 121.4, 125.5, 116.9, 121.3, 127.3, 131.6, 132.1, 161.4, 180.2, 166.7, 175.6, 159.7, 168.0, 160.8, 160.8, 160.6, 167.2, 168.4, 127.8, 132.8, 133.1, 127.3, 125.9, 129.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 111.2, 113.6, 122.7, 125.3, 134.3, 123.1, 135.6, 124.3, 132.2, 135.9, 165.6, 173.8, 153.0, 158.5, 142.9, 153.4, 151.9, 147.4, 142.9, 152.6, 132.1, 108.1, 111.6, 108.2, 109.1, 100.5, 97.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 111.8, 112.2, 115.4, 125.2, 132.8, 119.8, 132.0, 125.8, 132.3, 133.7, 168.5, 178.4, 163.4, 166.8, 158.3, 164.5, 155.5, 153.9, 151.6, 164.4, 143.6, 127.7, 127.6, 119.8, 121.9, 115.8, 111.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 115.6, 114.6, 119.6, 133.2, 139.8, 123.6, 134.3, 129.2, 139.0, 139.5, 177.4, 185.3, 168.2, 170.0, 157.6, 163.9, 159.6, 152.8, 151.5, 162.4, 145.0, 121.9, 120.8, 116.5, 122.4, 111.1, 111.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 98.4, 109.2, 85.0, 120.3, 132.6, 145.2, 104.3, 102.0, 106.7, 126.9, 137.6, 158.8, 140.9, 168.3, 127.2, 160.9, 129.0, 128.3, 125.3, 158.0, 107.5, 102.4, 108.0, 116.6, 98.2, 114.2, 81.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 103.9, 107.9, 105.7, 106.7, 125.1, 117.5, 124.7, 121.0, 122.4, 123.6, 160.1, 170.5, 154.3, 166.8, 156.6, 162.6, 144.2, 149.3, 144.5, 164.7, 139.9, 136.3, 135.6, 114.9, 111.9, 115.3, 109.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Computers & Electronics',
      category: 'Computers & Electronics',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 107.2, 109.8, 114.5, 116.2, 125.4, 116.3, 134.5, 118.7, 123.0, 125.9, 153.9, 161.8, 151.1, 152.9, 137.8, 149.9, 143.9, 143.9, 140.3, 151.1, 127.8, 110.4, 114.7, 111.4, 109.6, 100.1, 95.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 102.0, 99.6, 102.3, 108.0, 110.9, 101.0, 82.5, 59.1, 61.8, 57.9, 62.6, 63.4, 66.3, 74.4, 71.9, 77.1, 82.5, 88.8, 87.4, 92.8, 94.8, 101.1, 93.4, 93.3, 91.5, 94.4, 99.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 100.5, 102.1, 101.5, 108.0, 108.8, 100.9, 85.0, 60.8, 61.6, 57.6, 61.6, 63.0, 66.9, 75.1, 74.9, 81.5, 84.9, 92.6, 93.3, 99.2, 98.7, 104.5, 97.8, 97.3, 97.8, 99.6, 103.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 95.2, 98.4, 101.0, 102.8, 115.8, 100.4, 78.5, 59.0, 58.4, 61.4, 65.5, 65.0, 66.5, 84.9, 74.3, 74.0, 82.3, 92.7, 83.4, 93.0, 93.3, 104.8, 89.2, 89.5, 89.5, 96.0, 98.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 104.8, 101.0, 104.1, 108.2, 114.6, 104.4, 83.8, 57.8, 61.4, 59.0, 64.7, 63.7, 67.5, 76.2, 71.8, 76.0, 81.0, 89.3, 88.9, 92.0, 91.6, 98.7, 91.6, 93.2, 90.7, 91.8, 97.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 104.6, 101.9, 104.6, 113.9, 113.5, 103.0, 89.8, 62.3, 64.8, 59.3, 64.4, 64.5, 70.3, 80.0, 79.4, 85.2, 88.9, 96.5, 97.5, 102.1, 103.5, 110.4, 102.6, 101.8, 103.0, 104.6, 109.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 95.8, 101.6, 97.4, 102.9, 105.1, 96.8, 77.5, 56.7, 56.8, 56.5, 58.7, 59.7, 63.5, 70.7, 68.8, 74.2, 78.4, 85.9, 86.1, 90.8, 89.7, 97.0, 88.3, 88.8, 87.9, 90.4, 94.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 98.4, 100.3, 100.8, 101.7, 105.4, 104.1, 88.4, 68.5, 63.2, 58.1, 63.2, 67.9, 66.8, 76.6, 78.4, 86.9, 90.4, 100.7, 97.3, 111.1, 107.2, 107.4, 104.2, 102.4, 104.4, 107.6, 107.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 97.0, 96.5, 99.9, 106.4, 105.2, 96.5, 79.5, 61.5, 61.5, 54.7, 58.5, 63.0, 64.1, 71.7, 68.4, 73.8, 83.0, 84.9, 82.1, 89.5, 95.3, 100.5, 94.0, 90.7, 89.0, 94.0, 89.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 103.5, 100.5, 105.1, 110.7, 113.2, 102.8, 82.4, 58.2, 59.5, 58.5, 63.8, 62.7, 67.4, 74.1, 70.1, 74.2, 80.4, 87.5, 86.9, 89.8, 91.5, 97.8, 91.0, 92.7, 89.6, 90.9, 94.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 104.7, 100.3, 103.9, 109.5, 113.9, 103.3, 84.4, 58.8, 62.8, 59.1, 64.6, 64.3, 67.6, 76.0, 73.6, 78.6, 83.1, 90.6, 89.3, 94.2, 95.6, 102.1, 94.2, 95.0, 92.9, 95.3, 103.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 96.4, 103.0, 98.0, 103.3, 104.4, 97.0, 77.6, 55.9, 57.1, 55.3, 57.6, 59.0, 62.8, 68.4, 68.1, 74.8, 77.7, 84.5, 86.5, 90.6, 89.2, 96.1, 89.2, 89.6, 88.6, 90.3, 94.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 104.7, 99.3, 103.6, 108.8, 113.5, 102.7, 82.9, 58.2, 63.0, 59.2, 64.6, 64.6, 66.7, 74.5, 72.9, 78.2, 82.5, 89.5, 86.7, 92.9, 95.5, 101.5, 92.9, 93.9, 90.9, 94.5, 104.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 92.0, 94.5, 87.7, 99.4, 96.3, 89.5, 74.9, 60.0, 51.9, 59.9, 58.3, 57.7, 65.4, 69.3, 66.9, 68.9, 78.2, 88.0, 86.9, 89.6, 88.2, 93.4, 79.6, 81.0, 79.6, 83.4, 92.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 94.0, 93.0, 92.8, 99.3, 101.5, 91.8, 76.7, 60.4, 65.4, 52.4, 55.0, 62.8, 60.9, 72.3, 67.1, 72.1, 82.9, 81.3, 77.7, 86.2, 93.3, 101.2, 92.2, 85.2, 84.5, 92.0, 86.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 101.2, 100.0, 111.1, 120.8, 111.4, 99.7, 78.9, 59.1, 54.2, 56.5, 61.5, 60.3, 67.6, 68.0, 64.9, 69.1, 78.7, 81.5, 80.3, 82.5, 91.7, 95.3, 90.8, 93.0, 87.5, 89.2, 85.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Gas Stations',
      category: 'Gas Stations',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 101.7, 97.7, 100.8, 106.2, 110.6, 99.9, 81.2, 58.8, 63.5, 57.6, 62.3, 64.2, 65.3, 74.3, 71.5, 76.5, 82.6, 87.6, 84.4, 91.2, 94.9, 101.5, 92.6, 91.6, 89.3, 93.9, 99.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 107.6, 103.8, 102.5, 106.1, 117.3, 147.6, 166.2, 110.2, 119.0, 117.2, 115.8, 118.6, 118.9, 123.1, 118.9, 115.9, 114.4, 118.7, 108.3, 112.3, 109.3, 135.2, 122.1, 122.4, 120.7, 120.2, 114.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 101.2, 99.9, 104.4, 104.2, 121.5, 141.7, 157.4, 111.1, 116.2, 113.6, 111.9, 111.8, 119.6, 121.4, 115.1, 115.8, 114.9, 116.9, 111.7, 115.9, 107.7, 131.7, 116.3, 120.0, 117.6, 114.4, 102.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 105.2, 109.2, 95.4, 99.5, 110.8, 124.3, 132.5, 97.7, 110.6, 106.9, 113.3, 103.5, 107.4, 112.4, 118.7, 111.2, 110.6, 123.9, 112.6, 119.3, 116.8, 134.2, 117.2, 107.8, 108.5, 110.9, 98.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 108.2, 105.0, 100.3, 106.0, 118.7, 145.1, 155.8, 104.7, 113.9, 110.9, 108.0, 109.7, 115.7, 119.5, 120.0, 114.9, 110.5, 121.3, 110.4, 123.2, 114.9, 137.5, 120.2, 116.0, 116.7, 114.4, 106.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 108.4, 105.4, 100.5, 104.3, 116.8, 136.3, 152.1, 105.1, 113.2, 109.4, 109.8, 110.9, 115.4, 120.7, 122.2, 113.8, 113.1, 121.5, 111.4, 119.2, 114.7, 136.5, 123.0, 118.3, 118.4, 118.3, 111.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 107.6, 99.4, 97.3, 104.4, 119.5, 137.5, 161.1, 103.4, 111.9, 111.0, 109.5, 116.5, 113.9, 117.0, 110.3, 114.2, 109.9, 118.9, 103.3, 109.8, 107.2, 135.2, 109.5, 110.9, 134.6, 109.2, 100.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 108.9, 104.5, 102.1, 105.0, 115.7, 143.8, 159.9, 108.8, 116.7, 114.9, 112.8, 114.4, 117.0, 121.6, 118.4, 115.8, 113.5, 119.5, 110.8, 115.4, 112.0, 135.1, 120.0, 119.1, 117.2, 115.5, 107.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 111.1, 106.3, 101.1, 103.3, 112.9, 139.7, 148.6, 106.8, 115.6, 112.6, 112.8, 110.5, 115.3, 122.4, 119.7, 118.8, 115.1, 125.6, 118.7, 122.5, 116.5, 135.6, 116.5, 112.4, 107.8, 105.4, 95.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 108.5, 104.1, 102.7, 105.4, 115.9, 145.0, 164.0, 110.1, 117.4, 116.2, 113.5, 116.3, 117.7, 121.8, 118.0, 115.0, 113.5, 117.5, 108.6, 112.3, 110.5, 134.7, 121.2, 121.6, 119.9, 118.8, 112.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 109.5, 104.6, 102.2, 104.1, 116.6, 131.3, 154.1, 107.5, 113.3, 108.6, 110.5, 114.2, 117.3, 124.2, 125.4, 113.5, 116.3, 121.1, 112.1, 115.2, 113.8, 136.2, 127.3, 123.5, 122.8, 124.3, 119.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 108.1, 104.7, 102.6, 105.9, 116.9, 146.8, 163.2, 110.7, 119.9, 117.1, 116.5, 118.3, 119.7, 125.0, 119.8, 117.2, 115.2, 121.4, 111.3, 115.0, 111.2, 136.0, 121.6, 120.4, 118.4, 117.4, 110.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 110.7, 108.5, 102.7, 105.7, 114.9, 144.7, 154.0, 112.6, 123.4, 117.6, 119.5, 118.3, 122.5, 131.8, 123.7, 121.9, 117.8, 131.1, 121.5, 124.1, 118.4, 139.3, 120.7, 113.6, 110.6, 108.4, 100.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 109.4, 104.4, 103.1, 105.1, 113.8, 146.7, 164.7, 110.9, 116.9, 117.9, 111.6, 114.0, 116.3, 119.1, 114.0, 114.3, 111.3, 114.5, 107.7, 111.2, 110.8, 133.5, 117.7, 119.7, 117.7, 114.9, 106.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 113.7, 102.7, 101.0, 101.7, 111.2, 138.6, 147.3, 102.7, 107.6, 108.5, 104.5, 103.1, 109.2, 114.2, 115.1, 117.6, 113.3, 119.4, 117.3, 121.7, 114.1, 131.5, 110.9, 112.5, 104.0, 99.8, 87.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 107.3, 103.9, 100.5, 105.6, 119.1, 143.9, 156.5, 105.4, 114.0, 111.3, 108.6, 110.6, 116.0, 119.5, 118.5, 115.0, 111.0, 120.5, 109.9, 121.0, 113.3, 136.5, 118.7, 116.0, 118.5, 113.9, 105.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Grocery Stores',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 110.3, 103.8, 102.4, 104.3, 113.4, 144.5, 160.5, 108.7, 114.6, 115.5, 109.9, 111.5, 114.5, 117.9, 114.1, 115.1, 111.7, 115.8, 109.8, 113.6, 111.5, 133.1, 115.8, 117.8, 115.0, 111.1, 102.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 109.4, 114.8, 109.5, 111.9, 126.2, 134.5, 140.1, 117.2, 122.9, 121.3, 137.6, 135.4, 140.3, 141.6, 137.5, 135.9, 130.7, 129.8, 141.0, 127.7, 129.0, 141.7, 127.5, 132.0, 130.2, 125.7, 121.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 105.4, 106.8, 100.8, 113.5, 124.5, 137.4, 137.2, 107.1, 122.5, 112.9, 124.6, 129.5, 130.9, 134.0, 124.0, 128.1, 125.7, 121.9, 118.7, 120.2, 121.5, 127.0, 111.4, 113.1, 115.1, 109.7, 108.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 110.0, 108.8, 101.6, 113.9, 124.6, 136.6, 132.2, 102.7, 113.8, 113.8, 116.3, 122.0, 126.3, 129.6, 119.6, 127.9, 124.3, 126.1, 121.1, 118.9, 120.2, 122.7, 107.6, 108.9, 108.7, 110.8, 101.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 111.2, 117.6, 110.5, 117.4, 134.4, 139.6, 147.9, 121.4, 124.6, 118.7, 147.5, 156.2, 160.7, 168.2, 156.4, 157.5, 148.3, 142.2, 146.2, 144.7, 142.6, 148.4, 135.9, 137.8, 137.5, 136.8, 136.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 105.4, 108.9, 103.0, 117.2, 129.9, 141.0, 137.3, 108.4, 117.7, 119.3, 130.4, 137.5, 137.0, 139.6, 124.7, 135.1, 125.5, 124.7, 121.0, 124.8, 117.9, 129.2, 111.1, 113.9, 114.5, 112.2, 108.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 107.2, 112.2, 102.8, 120.1, 132.8, 145.3, 139.1, 108.4, 119.1, 119.6, 132.5, 139.6, 143.9, 149.0, 133.1, 139.0, 130.2, 125.6, 129.5, 132.1, 125.5, 132.9, 115.4, 124.7, 121.6, 117.9, 116.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 106.3, 110.6, 102.0, 118.5, 131.2, 144.3, 137.1, 106.9, 117.9, 118.9, 129.0, 137.6, 143.5, 146.8, 131.3, 137.6, 129.4, 124.5, 128.9, 132.8, 126.3, 132.1, 115.6, 122.6, 121.1, 118.1, 115.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 113.2, 120.9, 105.6, 128.2, 139.4, 154.7, 155.6, 115.8, 124.0, 124.3, 151.0, 148.3, 151.5, 161.2, 138.3, 148.7, 138.5, 132.2, 139.5, 134.5, 127.7, 138.9, 116.6, 139.0, 123.1, 121.2, 117.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 109.2, 113.3, 106.7, 122.6, 137.6, 145.1, 140.8, 110.6, 119.9, 122.6, 139.7, 149.9, 149.6, 150.9, 137.2, 143.6, 134.5, 132.8, 130.3, 131.3, 126.0, 135.2, 119.4, 123.9, 121.9, 119.5, 116.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 108.1, 112.4, 106.0, 119.8, 134.4, 142.8, 140.7, 111.5, 119.9, 120.8, 137.6, 146.4, 146.9, 149.6, 135.8, 142.7, 133.4, 131.4, 129.5, 131.1, 125.7, 135.1, 119.0, 122.5, 121.7, 119.6, 116.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 106.4, 109.0, 102.8, 116.7, 129.1, 140.1, 136.2, 107.3, 117.0, 118.1, 127.8, 134.6, 134.9, 138.0, 124.3, 133.7, 125.2, 125.0, 121.0, 123.5, 118.3, 128.0, 110.4, 113.3, 113.7, 111.9, 107.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 107.7, 108.7, 102.4, 113.4, 124.8, 136.7, 135.7, 106.9, 119.3, 114.5, 123.4, 127.5, 130.5, 133.5, 124.3, 129.2, 125.9, 124.6, 122.8, 120.8, 122.1, 127.5, 112.3, 114.3, 114.9, 112.4, 107.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 108.0, 111.7, 105.0, 118.7, 132.5, 142.0, 139.6, 110.3, 119.7, 119.6, 134.5, 142.3, 143.6, 146.7, 133.4, 139.9, 131.7, 129.5, 128.3, 129.4, 125.0, 133.5, 117.4, 121.3, 120.5, 118.1, 115.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 107.1, 114.1, 106.1, 122.9, 136.7, 141.4, 134.3, 111.2, 122.2, 118.8, 137.1, 144.9, 136.9, 152.0, 141.4, 137.7, 125.3, 125.9, 120.5, 122.1, 115.6, 132.2, 112.4, 124.1, 124.3, 111.7, 125.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 109.0, 114.4, 106.9, 117.3, 132.2, 141.0, 142.7, 115.0, 121.7, 119.1, 138.9, 146.3, 151.4, 156.5, 144.1, 147.0, 138.6, 133.6, 138.6, 138.0, 134.5, 141.0, 126.7, 131.0, 130.0, 127.9, 126.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Grocery & Wholesale Stores',
      category: 'Wholesale Stores',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 108.6, 112.3, 105.5, 121.0, 135.2, 144.0, 140.6, 110.1, 120.6, 120.9, 137.2, 146.0, 146.1, 148.0, 134.7, 140.8, 132.9, 130.7, 128.4, 129.3, 125.2, 133.8, 117.8, 122.3, 120.7, 117.7, 115.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 117.2, 112.9, 116.2, 112.6, 133.9, 112.4, 76.1, 34.0, 35.3, 29.6, 31.7, 35.1, 39.1, 49.3, 49.3, 62.1, 69.0, 85.3, 85.2, 95.4, 99.6, 119.1, 98.4, 99.4, 98.4, 92.8, 98.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 97.7, 106.1, 102.2, 102.9, 108.9, 118.5, 71.4, 28.9, 49.5, 36.5, 35.4, 41.8, 30.9, 57.0, 56.2, 76.8, 54.6, 77.5, 79.8, 76.9, 86.6, 102.2, 101.4, 89.6, 78.8, 73.2, 84.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 118.0, 113.9, 107.8, 108.3, 136.1, 115.0, 80.8, 32.4, 40.0, 26.5, 30.0, 33.7, 39.4, 48.0, 52.6, 69.8, 69.9, 99.9, 100.9, 103.6, 116.1, 139.3, 117.3, 117.8, 112.7, 113.1, 122.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 117.7, 112.3, 104.6, 107.0, 125.7, 112.1, 79.2, 34.5, 30.3, 25.1, 28.4, 30.4, 35.6, 46.0, 48.5, 66.6, 65.4, 85.2, 82.0, 86.6, 95.0, 110.2, 90.4, 86.7, 95.2, 89.1, 90.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 114.8, 109.5, 111.7, 110.8, 129.3, 110.6, 75.9, 36.0, 38.6, 30.3, 33.2, 35.6, 39.5, 47.9, 50.5, 63.7, 66.7, 87.2, 85.6, 92.5, 98.0, 117.5, 96.8, 97.2, 95.3, 91.9, 95.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 98.2, 100.5, 101.3, 100.1, 115.7, 106.9, 72.2, 31.5, 36.0, 28.6, 25.1, 31.4, 34.8, 48.4, 50.9, 55.6, 59.0, 88.1, 79.5, 90.7, 89.5, 121.0, 84.1, 92.0, 79.3, 93.7, 87.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 115.7, 110.0, 114.4, 110.9, 131.1, 110.6, 73.0, 37.2, 37.1, 30.5, 33.8, 34.3, 39.3, 49.3, 48.0, 62.2, 66.5, 82.7, 83.2, 91.4, 94.8, 115.4, 96.5, 96.8, 92.5, 89.2, 93.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 109.2, 99.5, 109.8, 108.0, 117.9, 98.4, 60.6, 46.2, 48.0, 33.9, 40.4, 32.2, 40.4, 47.4, 45.4, 59.6, 56.1, 75.0, 73.4, 75.9, 77.5, 98.1, 86.5, 83.0, 75.6, 74.6, 74.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 111.7, 96.7, 107.4, 104.0, 120.0, 101.5, 56.9, 55.0, 47.3, 35.5, 47.1, 30.5, 41.6, 49.2, 40.1, 63.9, 55.0, 67.7, 73.7, 70.3, 70.5, 94.6, 89.3, 84.2, 63.7, 69.1, 69.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 105.7, 100.1, 110.6, 115.7, 113.5, 93.5, 64.5, 38.7, 51.0, 33.6, 34.7, 34.4, 40.2, 43.3, 50.4, 54.4, 56.5, 81.4, 70.2, 80.9, 81.6, 99.1, 77.9, 80.7, 89.5, 72.9, 71.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 112.8, 106.9, 111.5, 113.4, 128.1, 111.8, 81.3, 36.6, 41.1, 33.8, 36.0, 42.3, 42.0, 46.1, 55.0, 64.4, 69.4, 91.9, 87.6, 94.6, 99.9, 117.8, 92.2, 95.8, 93.8, 90.8, 91.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 117.2, 113.0, 107.2, 107.4, 130.9, 112.7, 79.0, 33.1, 36.3, 26.1, 29.3, 32.3, 37.7, 47.4, 51.0, 67.6, 67.3, 93.1, 91.9, 95.5, 106.1, 125.5, 105.1, 102.9, 103.8, 102.6, 108.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 111.1, 105.7, 111.0, 113.5, 124.8, 108.8, 78.0, 36.7, 43.1, 33.9, 35.8, 40.9, 41.3, 46.0, 54.2, 63.1, 66.6, 89.6, 84.2, 91.6, 96.2, 114.0, 90.0, 92.9, 92.6, 87.0, 87.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 116.0, 111.3, 113.3, 112.1, 132.5, 112.7, 78.5, 34.5, 37.8, 30.3, 32.7, 37.0, 40.0, 48.1, 51.6, 64.1, 69.2, 89.8, 88.6, 96.6, 102.6, 122.3, 99.9, 101.6, 99.6, 95.8, 100.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 108.6, 109.7, 117.6, 103.6, 121.7, 98.8, 64.8, 30.0, 42.7, 28.4, 28.7, 32.8, 36.5, 51.3, 54.0, 56.5, 59.3, 87.8, 81.2, 85.7, 95.6, 110.0, 98.7, 84.6, 86.1, 102.3, 103.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Personal Care',
      category: 'Personal Care',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 113.7, 110.3, 104.0, 105.8, 123.2, 111.9, 77.7, 33.7, 32.5, 26.4, 28.5, 31.4, 35.2, 47.1, 49.4, 65.9, 63.8, 85.0, 81.5, 86.4, 93.7, 111.0, 90.4, 87.6, 91.9, 88.5, 89.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 110.3, 104.2, 112.1, 112.8, 123.2, 106.9, 78.5, 54.4, 64.4, 55.9, 63.5, 66.3, 73.3, 79.7, 76.4, 80.1, 82.0, 95.3, 92.3, 96.3, 95.2, 107.8, 93.8, 95.6, 96.7, 97.0, 96.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 111.3, 103.1, 110.8, 111.0, 125.3, 110.8, 83.4, 55.1, 64.4, 56.6, 62.9, 69.7, 78.9, 85.6, 82.5, 86.7, 91.7, 104.7, 101.7, 110.3, 105.9, 118.5, 106.2, 109.5, 108.0, 110.0, 113.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 108.7, 105.5, 112.7, 111.6, 117.0, 99.9, 72.2, 50.7, 59.0, 49.0, 57.4, 56.4, 66.0, 68.9, 67.2, 70.6, 71.1, 84.4, 85.7, 86.0, 86.3, 98.5, 87.6, 88.1, 89.0, 86.3, 83.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 109.7, 103.3, 112.5, 112.1, 123.6, 109.8, 83.6, 58.3, 67.9, 62.2, 70.0, 72.5, 78.6, 86.7, 84.3, 86.6, 88.6, 99.1, 97.8, 101.4, 99.1, 110.3, 96.8, 100.8, 99.1, 99.7, 98.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 110.1, 108.0, 112.6, 111.9, 118.1, 99.2, 71.6, 51.3, 58.3, 47.2, 56.7, 53.6, 65.0, 66.1, 63.0, 66.9, 68.5, 82.5, 83.5, 82.6, 82.2, 100.2, 85.2, 86.8, 89.9, 84.6, 82.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 110.1, 104.0, 110.8, 112.3, 124.6, 108.4, 77.9, 55.5, 62.5, 55.3, 61.4, 67.5, 70.3, 77.4, 76.8, 79.9, 83.2, 94.7, 91.4, 95.4, 95.6, 109.2, 92.4, 91.7, 96.1, 97.1, 97.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 109.8, 102.7, 110.5, 110.6, 122.2, 107.7, 79.4, 54.2, 61.9, 54.7, 61.1, 66.4, 72.5, 79.5, 77.4, 81.7, 85.6, 97.7, 94.6, 102.2, 99.2, 111.5, 99.1, 99.8, 100.8, 102.9, 103.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 110.6, 103.1, 110.8, 111.0, 122.8, 106.0, 76.3, 53.3, 61.1, 55.0, 59.7, 65.0, 68.1, 75.7, 73.6, 78.3, 82.1, 92.5, 89.7, 93.4, 94.1, 107.8, 92.1, 90.0, 95.5, 96.7, 96.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 113.0, 115.2, 116.8, 129.5, 146.0, 132.7, 89.1, 60.7, 77.1, 66.2, 76.7, 80.0, 91.4, 90.9, 112.6, 102.5, 98.7, 107.6, 110.5, 109.8, 112.3, 114.9, 96.7, 105.4, 114.5, 108.4, 110.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 110.9, 103.8, 112.1, 113.4, 125.5, 109.5, 81.2, 55.7, 66.9, 58.8, 66.4, 70.2, 76.8, 84.5, 80.0, 84.0, 86.2, 99.8, 95.2, 100.6, 98.8, 111.3, 96.5, 99.4, 99.9, 101.3, 101.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 109.5, 103.8, 113.2, 112.8, 122.6, 107.5, 80.3, 55.5, 66.2, 59.5, 66.7, 68.9, 76.0, 82.8, 81.5, 83.6, 84.4, 95.3, 95.7, 96.9, 96.9, 106.0, 94.1, 96.9, 95.7, 95.3, 93.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 108.8, 103.9, 114.5, 112.7, 117.6, 99.3, 71.5, 48.3, 61.1, 52.1, 57.6, 59.0, 68.0, 72.3, 71.5, 74.1, 72.5, 84.8, 89.1, 84.4, 89.9, 94.4, 87.3, 86.6, 85.4, 83.3, 80.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 110.9, 105.3, 112.2, 114.0, 124.2, 106.1, 76.9, 53.8, 64.5, 54.3, 62.8, 64.8, 72.1, 77.9, 72.7, 77.2, 78.8, 94.0, 89.1, 92.9, 92.2, 107.0, 90.8, 92.7, 95.2, 94.9, 94.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 105.6, 103.0, 107.3, 111.1, 124.5, 110.3, 81.5, 66.1, 63.8, 51.3, 63.4, 76.2, 72.6, 80.4, 77.4, 77.3, 81.4, 101.3, 91.1, 99.4, 95.5, 115.0, 91.9, 94.6, 89.9, 93.3, 97.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 104.0, 100.5, 109.0, 108.6, 111.9, 103.2, 75.6, 53.9, 57.4, 49.2, 59.6, 60.5, 65.2, 71.8, 72.7, 76.1, 77.2, 90.4, 86.6, 100.7, 92.8, 100.8, 96.4, 95.9, 93.2, 98.0, 94.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Restaurants',
      category: 'Restaurants',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 111.6, 104.3, 112.2, 115.1, 126.7, 108.7, 78.9, 54.3, 67.2, 57.5, 65.4, 68.9, 75.1, 82.8, 76.5, 81.5, 82.9, 98.5, 91.3, 96.9, 96.2, 109.4, 93.0, 95.1, 97.7, 99.2, 100.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 103.0, 98.9, 112.1, 110.9, 100.0, 104.2, 66.8, 28.4, 18.5, 13.4, 22.2, 20.8, 22.7, 25.2, 30.3, 32.3, 34.2, 36.8, 50.4, 50.0, 51.8, 41.8, 44.7, 37.7, 38.2, 37.8, 36.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 74.2, 78.8, 95.9, 92.5, 74.7, 57.2, 33.7, 15.7, 9.4, 9.6, 3.7, 12.7, 26.3, 22.8, 25.0, 20.2, 21.8, 27.0, 41.1, 40.1, 20.4, 21.1, 30.6, 35.9, 49.9, 23.3, 16.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 92.3, 110.5, 88.9, 114.2, 92.0, 82.9, 42.0, 22.0, 10.6, 11.6, 13.5, 33.1, 9.8, 14.7, 21.1, 18.8, 17.5, 29.7, 30.3, 38.8, 59.4, 28.2, 19.5, 31.9, 30.1, 18.1, 16.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 95.1, 90.1, 95.2, 94.1, 73.4, 64.2, 33.3, 15.6, 16.9, 10.3, 18.5, 13.0, 12.6, 15.4, 17.0, 17.9, 18.8, 22.4, 25.9, 27.8, 27.2, 22.9, 20.7, 23.3, 21.1, 20.1, 18.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 104.7, 103.3, 101.7, 105.4, 94.6, 75.8, 36.7, 15.1, 14.9, 11.7, 14.7, 13.9, 17.6, 18.2, 21.0, 22.7, 22.2, 28.8, 30.5, 35.2, 39.7, 34.8, 27.5, 24.7, 19.7, 22.4, 24.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 100.2, 100.5, 101.0, 99.9, 92.8, 84.8, 39.1, 18.1, 16.8, 11.3, 17.7, 15.8, 14.3, 18.6, 18.7, 21.7, 22.6, 26.7, 33.1, 33.2, 33.3, 27.7, 25.4, 25.0, 22.3, 22.0, 21.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 100.2, 103.6, 88.7, 108.7, 84.0, 77.2, 63.6, 33.8, 13.3, 19.1, 15.7, 13.8, 19.5, 17.5, 24.1, 34.7, 25.2, 30.9, 34.5, 40.2, 32.2, 33.0, 36.1, 36.6, 34.6, 31.6, 27.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 93.3, 76.2, 97.1, 88.0, 66.2, 53.7, 24.8, 13.5, 15.7, 7.5, 10.4, 9.6, 10.3, 11.4, 13.5, 12.6, 13.9, 20.5, 19.2, 17.6, 26.7, 16.1, 11.4, 18.7, 19.8, 18.6, 13.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 97.8, 96.6, 99.5, 99.3, 89.9, 80.2, 40.0, 18.5, 15.8, 11.3, 15.8, 14.6, 15.0, 18.2, 19.5, 21.9, 22.3, 27.3, 32.2, 33.6, 34.6, 27.9, 25.6, 25.4, 23.3, 23.4, 22.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 103.6, 102.8, 105.2, 102.2, 103.5, 95.3, 43.0, 20.8, 16.1, 11.9, 14.0, 15.4, 15.5, 19.5, 19.1, 24.3, 24.1, 29.5, 36.3, 33.8, 36.2, 29.3, 26.9, 25.6, 23.8, 24.1, 23.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 80.4, 89.6, 87.9, 92.0, 89.2, 77.5, 37.8, 18.8, 11.6, 10.6, 10.8, 13.9, 12.2, 18.1, 18.4, 19.2, 20.4, 27.7, 30.4, 35.9, 33.3, 21.0, 21.4, 23.9, 23.0, 22.4, 19.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 99.2, 91.6, 99.7, 98.0, 82.6, 66.4, 31.8, 14.5, 15.0, 10.0, 12.6, 12.1, 14.9, 15.6, 18.1, 18.6, 18.9, 25.4, 26.2, 28.3, 33.9, 26.9, 21.0, 22.6, 20.6, 20.9, 20.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 95.3, 96.0, 95.2, 95.0, 75.7, 68.2, 32.7, 13.4, 18.3, 10.4, 24.0, 14.9, 12.7, 17.5, 17.8, 17.8, 20.5, 21.9, 28.3, 31.7, 26.5, 25.2, 23.4, 23.5, 19.3, 18.8, 19.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 79.2, 87.4, 87.2, 88.9, 89.8, 78.2, 37.5, 18.6, 11.9, 10.5, 11.0, 11.3, 11.5, 18.2, 17.5, 19.1, 20.7, 27.4, 29.7, 35.3, 30.6, 20.0, 21.0, 21.9, 20.1, 22.9, 19.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 103.8, 102.4, 105.2, 104.4, 100.3, 90.8, 44.7, 20.3, 16.1, 12.1, 15.4, 15.8, 17.2, 20.0, 21.3, 25.0, 25.0, 30.4, 36.7, 36.7, 39.5, 32.8, 29.7, 27.1, 24.7, 25.6, 26.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Airlines',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 90.9, 94.0, 96.2, 99.8, 92.5, 87.2, 52.0, 24.5, 14.4, 12.9, 15.7, 15.0, 16.7, 20.5, 23.1, 26.2, 26.2, 31.3, 37.8, 41.2, 38.3, 29.7, 31.7, 29.8, 28.7, 29.5, 27.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 110.9, 100.5, 120.9, 119.9, 138.9, 112.2, 87.4, 50.3, 39.1, 30.7, 39.0, 39.7, 50.0, 56.0, 72.1, 58.6, 77.4, 88.0, 82.1, 98.6, 106.7, 117.5, 115.3, 108.5, 102.6, 123.5, 112.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 118.7, 111.2, 114.3, 123.7, 141.6, 139.8, 92.5, 54.3, 35.8, 45.4, 53.1, 36.9, 59.8, 67.2, 68.1, 69.1, 89.5, 85.7, 95.1, 108.9, 131.0, 127.6, 113.6, 113.5, 155.7, 138.8, 131.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 93.2, 85.1, 105.5, 104.7, 128.8, 101.4, 79.1, 31.9, 26.5, 26.1, 27.1, 25.6, 46.5, 28.8, 56.8, 38.7, 56.2, 59.9, 70.5, 73.3, 75.5, 74.5, 93.5, 73.2, 83.1, 77.0, 61.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 148.9, 101.3, 140.9, 143.7, 163.8, 146.2, 158.1, 78.5, 70.5, 29.5, 50.2, 68.1, 106.0, 82.6, 98.8, 84.4, 109.6, 140.7, 106.4, 146.3, 179.7, 172.9, 179.3, 180.0, 131.2, 218.8, 131.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 121.4, 115.7, 140.6, 133.7, 125.7, 107.9, 83.7, 48.8, 51.8, 36.0, 39.8, 45.1, 44.0, 38.8, 75.1, 69.0, 112.5, 89.7, 84.4, 108.1, 104.4, 129.8, 141.9, 100.5, 118.7, 165.8, 100.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 112.2, 121.5, 136.2, 157.0, 143.6, 189.1, 115.6, 95.9, 71.0, 54.1, 64.7, 90.0, 104.5, 133.4, 145.4, 114.0, 151.9, 127.2, 144.0, 195.3, 196.2, 195.0, 205.0, 213.2, 239.1, 271.1, 209.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 113.5, 103.4, 127.9, 124.1, 130.1, 108.9, 88.4, 45.3, 44.3, 31.9, 36.1, 40.0, 50.2, 39.0, 70.5, 59.4, 91.9, 83.3, 81.3, 98.8, 100.4, 113.5, 127.7, 97.5, 106.9, 138.3, 89.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 122.1, 54.7, 60.2, 80.3, 98.0, 68.5, 68.4, 35.0, 37.7, 37.5, 24.0, 31.2, 33.6, 102.1, 63.0, 42.5, 81.8, 43.8, 107.2, 89.4, 108.5, 111.9, 75.3, 103.3, 108.6, 58.5, 106.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 121.4, 207.4, 133.0, 180.1, 166.9, 139.7, 132.5, 82.4, 35.0, 52.2, 70.2, 63.4, 133.0, 49.3, 64.4, 82.2, 92.2, 76.7, 129.1, 145.5, 229.6, 194.4, 225.5, 148.2, 265.8, 235.9, 232.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 108.4, 110.2, 111.5, 124.7, 123.1, 103.8, 87.9, 50.9, 46.6, 33.6, 38.7, 44.9, 53.7, 52.5, 75.4, 72.4, 89.6, 85.9, 91.5, 106.5, 113.5, 129.5, 134.6, 109.5, 133.7, 147.2, 114.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 117.9, 106.0, 119.3, 122.2, 144.2, 149.8, 90.4, 53.2, 35.7, 45.5, 54.9, 34.1, 53.5, 64.8, 69.3, 71.0, 90.2, 92.8, 88.8, 106.6, 120.8, 120.7, 103.7, 110.3, 147.4, 136.9, 120.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 122.7, 115.1, 136.7, 133.9, 149.3, 123.4, 94.8, 64.7, 48.1, 33.4, 48.7, 50.5, 53.8, 71.8, 83.7, 74.0, 92.2, 111.6, 88.4, 117.3, 128.8, 148.6, 133.9, 134.0, 116.0, 161.8, 149.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 121.1, 110.1, 128.1, 136.5, 147.2, 161.5, 109.2, 70.7, 52.3, 45.7, 57.2, 57.1, 77.9, 89.1, 97.9, 86.6, 112.6, 111.3, 108.9, 140.8, 153.8, 152.4, 147.6, 153.7, 173.5, 192.1, 150.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 108.6, 108.8, 111.5, 126.4, 130.8, 115.6, 92.9, 59.2, 48.0, 34.4, 43.0, 50.4, 59.9, 70.2, 84.8, 77.7, 89.1, 96.2, 97.1, 116.8, 126.2, 139.8, 136.8, 128.5, 140.6, 155.5, 135.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 111.3, 107.4, 117.1, 125.4, 131.8, 116.2, 91.4, 54.2, 45.4, 34.8, 42.0, 45.5, 56.8, 59.9, 78.3, 70.8, 90.0, 90.9, 91.8, 110.1, 118.5, 130.0, 131.2, 116.8, 131.5, 148.1, 120.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Car Rentals',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 101.3, 104.0, 95.8, 118.2, 120.1, 100.5, 88.5, 50.8, 44.3, 31.7, 37.0, 44.2, 55.8, 59.6, 75.9, 73.8, 77.9, 84.2, 93.8, 104.3, 114.1, 127.1, 127.6, 112.7, 136.7, 134.6, 117.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 89.6, 122.8, 115.7, 135.2, 154.9, 119.9, 31.0, 21.1, 21.0, 16.4, 46.4, 16.6, 30.1, 21.2, 22.4, 24.2, 55.8, 51.1, 37.1, 60.3, 58.1, 75.3, 67.4, 63.6, 68.2, 69.0, 56.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 104.9, 99.9, 106.4, 100.7, 99.9, 82.4, 33.7, 12.0, 13.8, 11.7, 16.6, 15.0, 12.5, 17.5, 37.3, 25.1, 20.5, 35.9, 36.2, 36.4, 41.3, 47.8, 43.1, 45.7, 49.9, 48.0, 37.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 106.8, 104.0, 122.9, 128.2, 123.8, 105.4, 54.4, 23.9, 24.0, 16.7, 22.2, 18.3, 21.6, 33.9, 31.6, 40.4, 45.7, 52.0, 59.0, 67.4, 65.9, 76.6, 71.9, 70.8, 74.3, 76.4, 74.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 106.2, 103.0, 113.6, 114.7, 118.4, 97.9, 54.0, 19.6, 25.2, 17.2, 17.8, 17.6, 21.4, 33.1, 27.5, 35.4, 39.1, 52.0, 49.9, 61.3, 62.1, 73.5, 71.4, 64.6, 67.3, 70.5, 73.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 96.1, 105.8, 112.2, 100.6, 105.0, 85.1, 41.8, 15.0, 16.6, 11.8, 14.3, 14.2, 13.5, 23.7, 23.3, 28.5, 29.4, 40.7, 34.8, 43.5, 48.8, 63.3, 55.6, 48.7, 53.6, 58.7, 61.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 95.3, 102.0, 109.0, 96.5, 97.9, 76.3, 41.1, 14.6, 16.0, 11.0, 10.8, 12.7, 11.2, 24.0, 23.2, 26.3, 25.2, 38.2, 34.0, 40.3, 46.0, 61.0, 53.2, 45.0, 49.1, 56.9, 60.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 105.8, 109.8, 111.5, 122.9, 112.4, 73.7, 37.4, 14.9, 18.3, 13.9, 9.7, 9.6, 15.1, 15.9, 32.6, 23.7, 22.6, 30.2, 28.3, 37.2, 39.4, 54.0, 46.2, 47.7, 43.2, 45.0, 44.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 115.9, 131.2, 149.1, 102.5, 125.4, 148.0, 65.9, 10.4, 17.3, 15.5, 12.8, 30.0, 20.2, 23.6, 26.1, 63.4, 45.0, 57.1, 41.9, 60.9, 72.8, 75.9, 69.5, 74.5, 91.5, 67.0, 74.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 106.3, 103.2, 117.3, 117.1, 114.8, 97.8, 46.9, 19.1, 20.0, 14.7, 19.8, 17.4, 18.1, 27.4, 33.6, 35.2, 36.2, 46.0, 49.9, 55.5, 56.7, 65.7, 60.9, 61.4, 65.5, 65.4, 60.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 95.4, 117.7, 116.2, 104.8, 103.4, 96.9, 53.0, 23.1, 23.1, 16.0, 13.4, 19.9, 16.8, 36.9, 48.8, 30.1, 37.7, 47.2, 44.8, 46.8, 55.0, 64.0, 73.6, 49.2, 64.8, 62.2, 71.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 106.3, 107.9, 109.7, 115.6, 115.2, 86.4, 45.4, 16.1, 22.2, 15.6, 13.8, 13.3, 18.1, 24.2, 26.8, 27.9, 29.1, 40.8, 37.3, 49.3, 51.6, 61.1, 58.6, 53.3, 52.8, 55.7, 57.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 104.4, 104.6, 112.3, 112.4, 113.0, 90.1, 47.1, 17.4, 21.5, 15.2, 15.7, 15.5, 18.1, 27.1, 29.6, 31.1, 32.7, 44.6, 42.4, 51.4, 53.7, 65.5, 61.6, 56.9, 59.2, 61.6, 62.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 107.2, 106.1, 108.4, 110.5, 115.2, 92.4, 50.7, 16.5, 24.5, 16.6, 14.8, 15.3, 19.4, 29.2, 23.6, 30.5, 31.8, 46.6, 42.6, 55.9, 58.6, 64.7, 65.5, 56.2, 57.8, 61.5, 65.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 104.6, 106.8, 110.0, 113.0, 106.9, 79.0, 37.4, 14.6, 17.0, 13.3, 12.6, 12.5, 14.3, 18.3, 35.8, 24.8, 23.1, 33.8, 32.7, 37.7, 41.5, 52.6, 47.4, 47.1, 47.6, 47.6, 44.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 96.8, 99.0, 110.4, 96.9, 104.8, 87.1, 51.4, 17.9, 22.1, 15.1, 13.7, 18.1, 18.0, 33.8, 30.1, 32.4, 36.0, 51.8, 43.0, 50.3, 54.1, 75.8, 70.3, 58.7, 64.7, 69.9, 77.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Travel',
      category: 'Lodging',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 99.8, 85.6, 110.1, 94.1, 117.1, 100.9, 68.1, 21.2, 31.8, 21.6, 18.6, 26.3, 29.9, 48.8, 33.4, 43.5, 53.4, 76.6, 57.2, 68.6, 67.2, 105.7, 97.3, 85.7, 90.8, 95.1, 108.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 119.2, 77.7, 88.5, 123.0, 151.9, 115.4, 161.5, 122.1, 100.0, 89.4, 107.5, 106.5, 78.2, 89.1, 78.6, 73.0, 75.1, 95.2, 108.8, 83.9, 83.8, 77.6, 89.1, 105.4, 85.8, 82.9, 105.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 109.3, 92.4, 104.7, 142.5, 152.1, 119.9, 153.9, 122.2, 115.5, 67.0, 134.4, 104.2, 105.1, 94.1, 91.5, 91.0, 67.3, 104.0, 99.9, 103.7, 74.0, 99.5, 98.0, 117.0, 80.6, 77.0, 114.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 94.7, 90.1, 69.3, 118.1, 129.3, 132.0, 194.0, 157.1, 93.5, 94.8, 105.7, 96.7, 92.0, 106.1, 122.6, 86.1, 79.7, 105.6, 110.9, 102.5, 97.6, 102.1, 137.9, 132.2, 107.2, 92.5, 103.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'female',
      age: 'all',
      data:
        '[100.0, 88.9, 96.9, 68.3, 109.2, 144.4, 128.2, 141.4, 127.2, 98.7, 61.9, 107.6, 95.7, 109.2, 107.5, 127.5, 89.8, 94.8, 116.1, 110.9, 86.1, 93.0, 104.9, 128.2, 130.9, 103.9, 94.9, 125.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 161.1, 129.8, 77.9, 150.8, 156.5, 199.3, 262.1, 343.8, 73.0, 85.0, 157.7, 139.6, 73.3, 220.0, 207.1, 110.8, 82.7, 163.1, 196.5, 122.3, 111.1, 191.8, 242.1, 105.1, 164.0, 155.4, 141.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 111.8, 66.1, 125.2, 130.4, 175.6, 175.8, 208.8, 209.0, 135.7, 79.8, 156.3, 105.2, 79.3, 100.7, 90.9, 87.4, 85.3, 82.2, 104.9, 118.0, 86.5, 89.1, 114.8, 150.8, 83.2, 86.2, 148.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'all',
      age: 'all',
      data:
        '[100.0, 113.1, 84.3, 98.7, 133.9, 153.8, 122.2, 164.1, 131.3, 110.9, 77.5, 124.9, 106.0, 92.6, 93.1, 86.9, 82.5, 72.6, 98.4, 104.3, 96.8, 78.8, 89.4, 95.5, 114.7, 83.3, 80.3, 113.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 93.2, 73.9, 88.6, 145.6, 159.7, 146.9, 106.6, 148.2, 112.1, 67.9, 121.1, 102.0, 126.1, 121.7, 114.5, 115.9, 77.7, 120.0, 123.3, 119.0, 94.2, 126.1, 156.2, 165.3, 130.1, 105.7, 130.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'female',
      age: 'under 25',
      data:
        '[100.0, 95.7, 99.1, 81.5, 114.7, 189.4, 106.3, 219.1, 146.7, 132.6, 106.3, 125.4, 81.7, 107.0, 75.9, 206.4, 111.6, 91.4, 118.5, 140.9, 235.7, 127.4, 192.3, 147.3, 119.5, 169.5, 239.2, 338.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 116.1, 52.9, 75.7, 57.3, 81.2, 73.9, 270.2, 130.1, 58.8, 361.7, 25.6, 89.8, 156.5, 110.4, 124.2, 43.5, 75.1, 344.0, 78.0, 98.2, 145.5, 82.6, 144.6, 135.1, 312.2, 280.5, 52.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 66.6, 76.1, 67.2, 91.2, 99.6, 109.7, 260.9, 143.9, 78.7, 111.0, 105.5, 93.3, 74.6, 84.7, 92.7, 63.9, 58.3, 64.6, 91.4, 102.3, 75.7, 65.8, 113.8, 143.4, 84.7, 55.2, 63.4]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 71.3, 103.2, 57.6, 92.8, 125.4, 138.6, 128.5, 122.6, 77.6, 48.6, 100.3, 96.5, 109.4, 98.4, 115.2, 58.4, 71.5, 103.4, 87.7, 68.7, 83.0, 101.2, 116.8, 108.8, 70.9, 74.4, 83.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 83.6, 81.3, 71.4, 104.4, 122.7, 113.5, 212.7, 137.4, 93.2, 98.7, 106.6, 94.7, 90.5, 100.3, 107.9, 85.8, 83.5, 96.5, 107.0, 93.6, 86.2, 78.4, 123.9, 148.0, 106.8, 75.7, 92.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 118.2, 91.6, 103.5, 146.7, 150.7, 118.7, 161.1, 119.3, 115.2, 68.8, 140.2, 110.2, 102.4, 86.9, 75.3, 88.7, 63.6, 102.9, 102.6, 95.4, 78.0, 82.4, 101.3, 108.8, 74.4, 71.3, 95.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 112.3, 69.6, 68.0, 156.2, 100.0, 112.8, 128.7, 125.7, 99.3, 140.8, 46.9, 63.0, 78.4, 70.1, 116.9, 105.6, 59.6, 108.3, 82.1, 139.9, 87.6, 90.2, 144.7, 124.5, 122.7, 88.8, 86.7]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 127.3, 75.8, 74.6, 169.1, 144.8, 147.0, 184.5, 171.6, 127.0, 153.9, 88.0, 85.5, 82.6, 73.8, 139.9, 99.9, 74.4, 103.4, 111.0, 159.7, 144.4, 131.9, 151.8, 133.3, 121.5, 136.8, 144.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 55.4, 137.4, 51.7, 232.8, 81.2, 56.4, 230.4, 172.9, 81.8, 62.5, 56.2, 70.5, 169.3, 32.1, 56.0, 37.1, 31.5, 66.8, 61.3, 65.5, 39.9, 57.2, 69.5, 84.7, 59.2, 60.9, 57.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'female',
      age: '35+',
      data:
        '[100.0, 99.3, 101.9, 114.0, 133.1, 151.3, 110.6, 160.4, 116.6, 117.6, 63.3, 129.0, 93.6, 101.4, 96.0, 112.4, 84.6, 69.9, 99.0, 84.8, 112.8, 58.0, 120.7, 66.7, 111.8, 71.1, 75.6, 143.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'all',
      age: '25-34',
      data:
        '[100.0, 118.2, 82.1, 97.1, 132.5, 149.2, 115.0, 159.6, 119.5, 105.4, 82.2, 119.1, 103.8, 86.4, 82.0, 76.9, 80.6, 62.5, 96.9, 98.7, 86.0, 83.2, 77.2, 89.2, 98.9, 77.1, 71.8, 92.1]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 96.3, 111.5, 63.1, 114.7, 132.2, 154.7, 168.2, 182.0, 77.2, 58.4, 113.3, 105.8, 99.1, 131.8, 137.7, 79.6, 76.0, 121.7, 117.4, 88.1, 92.5, 125.9, 153.6, 106.0, 100.7, 97.6, 100.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'other',
      age: '35+',
      data:
        '[100.0, 54.1, 122.9, 49.5, 241.2, 67.7, 103.6, 175.3, 21.1, 102.8, 30.5, 5.0, 13.8, 109.2, 62.8, 11.7, 233.1, 108.7, 139.5, 51.9, 183.4, 125.8, 68.6, 147.0, 58.6, 160.3, 76.9, 110.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'other',
      age: 'under 25',
      data:
        '[100.0, 118.2, 65.5, 69.2, 156.8, 105.4, 117.7, 109.6, 136.6, 103.0, 130.8, 53.5, 65.7, 67.3, 66.9, 127.5, 98.0, 52.7, 81.6, 85.8, 139.4, 77.8, 93.2, 144.5, 130.5, 99.9, 71.0, 87.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 211.0, 90.5, 89.3, 298.7, 261.9, 334.8, 475.9, 363.5, 227.7, 323.2, 193.0, 179.9, 118.1, 102.5, 105.8, 92.6, 148.8, 181.1, 184.3, 147.8, 468.2, 224.6, 191.3, 164.7, 154.0, 294.7, 137.6]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'male',
      age: 'all',
      data:
        '[100.0, 95.7, 88.8, 70.8, 116.2, 121.5, 142.4, 273.5, 200.6, 86.0, 117.4, 122.0, 108.5, 76.8, 115.7, 118.7, 76.0, 68.9, 93.0, 120.0, 109.3, 105.9, 102.7, 146.6, 136.2, 106.2, 91.1, 85.0]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'male',
      age: 'under 25',
      data:
        '[100.0, 114.7, 82.7, 100.2, 146.0, 190.5, 143.5, 201.6, 224.4, 151.5, 85.5, 160.3, 134.6, 126.4, 157.4, 121.9, 103.8, 112.9, 145.9, 152.5, 116.2, 109.9, 122.3, 193.6, 164.7, 129.3, 138.7, 193.8]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'all',
      age: '35+',
      data:
        '[100.0, 107.2, 97.4, 95.6, 133.4, 148.8, 111.1, 166.4, 112.3, 107.5, 67.8, 122.3, 107.4, 96.6, 97.0, 94.4, 73.6, 81.8, 94.2, 103.9, 104.1, 58.5, 101.3, 72.4, 116.4, 78.0, 80.8, 128.2]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Withdrawals',
      gender: 'female',
      age: '25-34',
      data:
        '[100.0, 105.7, 90.0, 77.1, 125.1, 156.8, 120.8, 143.0, 128.9, 115.0, 68.8, 112.3, 96.9, 109.2, 121.4, 128.3, 118.3, 118.9, 128.7, 130.0, 81.3, 98.0, 95.7, 136.8, 155.0, 127.5, 94.2, 135.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'all',
      age: 'under 25',
      data:
        '[100.0, 106.4, 72.4, 107.7, 138.8, 173.9, 159.1, 174.2, 192.8, 131.7, 77.3, 145.9, 110.9, 105.2, 120.4, 105.6, 100.3, 89.1, 109.0, 121.7, 117.9, 94.3, 108.6, 146.1, 158.7, 108.9, 104.5, 152.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'male',
      age: '25-34',
      data:
        '[100.0, 119.1, 72.4, 92.0, 117.9, 146.2, 110.8, 151.9, 114.2, 93.4, 96.4, 94.6, 93.4, 67.7, 72.5, 73.6, 72.5, 58.7, 89.2, 92.7, 73.7, 89.3, 69.5, 76.4, 88.1, 78.0, 71.7, 87.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'other',
      age: 'all',
      data:
        '[100.0, 105.2, 73.7, 113.4, 139.8, 169.5, 161.5, 222.2, 212.2, 134.3, 76.4, 153.8, 112.6, 94.8, 105.7, 99.9, 82.9, 86.3, 86.7, 106.0, 118.6, 80.1, 92.1, 110.5, 143.0, 85.1, 84.5, 138.3]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'other',
      age: '25-34',
      data:
        '[100.0, 90.0, 85.8, 63.2, 142.5, 191.8, 126.6, 333.3, 274.2, 166.9, 58.7, 216.2, 214.7, 166.9, 213.7, 217.5, 82.8, 142.6, 144.1, 154.6, 170.3, 58.9, 148.6, 108.0, 125.0, 123.9, 89.5, 118.9]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
    {
      industry: 'Financial Planning & Investments',
      category: 'Deposits',
      gender: 'male',
      age: '35+',
      data:
        '[100.0, 121.0, 88.8, 75.5, 126.5, 150.7, 115.8, 169.3, 102.3, 96.5, 73.7, 118.6, 127.4, 85.3, 103.1, 74.3, 62.4, 100.5, 90.2, 131.1, 96.0, 60.4, 80.0, 79.9, 124.5, 88.1, 88.7, 114.5]',
      dates:
        '["01/06/20", "01/13/20", "01/20/20", "01/27/20", "02/03/20", "02/10/20", "02/17/20", "02/24/20", "03/02/20", "03/09/20", "03/16/20", "03/23/20", "03/30/20", "04/06/20", "04/13/20", "04/20/20"]',
    },
  ]

  const randomId$2 = 'industry' + Math.random().toString(16).split('.')[1]
  document.currentScript.setAttribute('data-content-id', randomId$2)
  window.$cardifyScripts = window.$cardifyScripts || {}
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
  }

  document.addEventListener('DOMContentLoaded', showChartPreview)
  document.addEventListener('DOMContentLoaded', emailValidationInit)
  document.addEventListener('DOMContentLoaded', momWowRender)
})
