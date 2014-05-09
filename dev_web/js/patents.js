$(document).ready(function () {
    $('#patents').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Wearable Patents Filed in the US, 2003-2013'
        },
        xAxis: {
            categories: ['2003', '2004', '2005', '2006', '2007','2008','2009','2010','2011','2012','2013']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total Patents per Year'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -70,
            verticalAlign: 'top',
            y: 20,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function() {
                return '<b>'+ this.x +'</b><br/>'+
                    this.series.name +': '+ this.y +'<br/>'+
                    'Total: '+ this.point.stackTotal;
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black, 0 0 3px black'
                    }
                }
            }
        },
        series: [{
            name: 'Watches',
            data: [6,14,35,47,61,84,86,94,106,110]
        }, {
            name: 'Glasses',
            data: [1,3,5,7,11,17,23,26,30,32]
        }, {
            name: 'Cameras',
            data: [2,7,9,10,14,17,20,24,25,25]
        }, {
            name: 'Textiles',
            data: [2,6,10,12,13,15,20,21,21,22]
        }

        ]
    });
});

