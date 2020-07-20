const isMobile = document.body.clientWidth < 768;
const CHART_COLORS = window.cardify.CHART_COLORS;
const CHART_HEIGHT = window.cardify.CHART_HEIGHT;

Chart.defaults.global.tooltips.displayColors = false;
Chart.defaults.global.hover.mode = 'nearest';
Chart.defaults.global.hover.intersect = false;
Chart.defaults.global.legend.display = false;
Chart.defaults.global.responsive = false;

const SIMPLE_LINE_CHART_OPTIONS = window.cardify.simpleLineOptions();

$(function () {
  window.cardify.loadScript('https://d2j940tllnytyh.cloudfront.net/cardify/index/data/industry.js').then((_data) => {
    const data = _data.filter((entry) => entry.industry === 'Travel');
    const COLORS_MAPPING = { 'Airlines': CHART_COLORS[0], 'Car Rentals': CHART_COLORS[1], 'Lodging': CHART_COLORS[2] };

    console.log('Finished loading data for travel page', data);

    const chart = window.cardify.showChart('#travel-graph-container', {
      height: 350,
      type: 'line',
      data: {
        labels: window.cardify.getWeeklyDateLabels('02/02/2020'),
        datasets: data.map((entry) => ({
          hidden: entry.gender !== 'all' || entry.age !== 'all',
          label: entry.category,
          data: JSON.parse(entry.data), // TODO do it safetly
          gender: entry.gender,
          age: entry.age,
          category: entry.category,

          fill: false,
          borderWidth: 2,
          borderColor: COLORS_MAPPING[entry.category],
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointHoverBorderColor: CHART_COLORS[0],
          pointHitRadius: 30,
        })),
      },

      share: { twitter: true, linkedin: true },
      bottomLabels: ['Airlines', 'Car Rentals', 'Lodging'],

      selector: {
        dropdowns: [
          { label: 'Gender', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'all', label: 'All' }, { value: 'other', label: 'Other' }], default: 'all' },
          { label: 'Age', options: [{ value: 'under 25', label: 'Under 25' }, { value: '25-34', label: '25-34' }, { value: '35+', label: '35+' }, { value: 'all', label: 'All' }], default: 'all' },
        ],
        onChange: ([gender, age, state], chart) => {
          chart.data.datasets.forEach((dataset) => {
            dataset.hidden = dataset.gender !== gender || dataset.age !== age;
          });
          chart.update();
        },
      },

      legend: {
        heading: 'Travel',
        labels: [''], // use V3 bottom labels there
        disableMinHegiht: true, // use V3 non fixed height option
      },

      options: Object.assign({}, SIMPLE_LINE_CHART_OPTIONS, {
        tooltips: {
          display: false,
          enabled: false,
          custom: window.cardify.tooltips.pelotonCustomTooltip({
            label: (data) => 'Indexed Spend',
            // date: (data) => data.label,
            value: (data) => data.value,
          }),
        },
      }),
    })[0];
  });
});

/* Paywall */
$(function () {
  setTimeout(function (e) {
    window.cardify.displayPaywall();
  }, 2000);
});
