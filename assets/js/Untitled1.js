
        function add_item(p, v, totaler, subtractor) {
            p.count++;
            p.leads += v.totaler;
            p.appts += v.subtractor;
            p.percent = (p.appts / p.leads) * 100;
            return p;
        }

        function remove_item(p, v) {
            p.count--;
            if (p.count == 0) {
                p.leads = 0;
                p.appts = 0;
                p.percent = 0;

            }
            else {
                p.leads -= v.totaler;
                p.appts -= v.subtractor;
                p.percent = (p.appts / p.leads) * 100;
            }
            return p;
        }

        function initialise() {
            return { count: 0, leads: 0, appts: 0, percent: 0 };
        };

var leads_to_appts_by_month = monthDim.group().reduce(add_item(leads, appts), remove_item(leads, appts), initialise());







//without filter this data represents all the employees, if filtered it only represents the chosen states data

    var monthDim = ndx.dimension(dc.pluck("month"));

    // calculates the percentage of leads that are converted to appointments

    var leads_to_appts_by_month = monthDim.group().reduce(
        function add_item(p, v) {
            p.count++;
            p.leads += v.leads;
            p.appts += v.appointments;
            p.percent = (p.appts / p.leads) * 100;
            return p;
        },

        function remove_item(p, v) {
            p.count--;
            if (p.count == 0) {
                p.leads = 0;
                p.appts = 0;
                p.percent = 0;

            }
            else {
                p.leads -= v.leads;
                p.appts -= v.appointments;
                p.percent = (p.appts / p.leads) * 100;
            }
            return p;
        },

        function initialise() {
            return { count: 0, leads: 0, appts: 0, percent: 0 };
        });


    // calculates the average amount of earnings lost
    var percent_lost_by_month = monthDim.group().reduce(
        function add_item(p, v) {
            p.count++;
            p.earned += v.earned;
            p.lost += v.lost;
            p.total = (p.lost / p.earned) * 100

            return p;
        },

        function remove_item(p, v) {
            p.count--;
            if (p.count == 0) {
                p.earned = 0;
                p.lost = 0;
            }
            else {
                p.earned -= v.earned;
                p.lost -= v.lost;
                p.total = (p.lost / p.earned) * 100

            }
            return p;
        },

        function initialise() {
            return { count: 0, earned: 0, lost: 0, total: 0 };

        });
        












function show_group_averages(ndx) {

    var monthDim = ndx.dimension(dc.pluck("month"));
    var stateDim = ndx.dimension(dc.pluck("store_location"));

    function leads_appointments_averager(dimension) {

        return dimension.group().reduce(

            function(p, v) {
                p.count++;
                p.leads += v.leads;
                p.appts += v.appointments;
                p.percent = (p.appts / p.leads) * 100;
                return p;
            },

            function(p, v) {
                p.count--;
                if (p.count == 0) {
                    p.leads = 0;
                    p.appts = 0;
                    p.percent = 0;

                }
                else {
                    p.leads -= v.leads;
                    p.appts -= v.appointments;
                    p.percent = (p.appts / p.leads) * 100;
                }
                return p;
            },

            function() {
                return { count: 0, leads: 0, appts: 0, percent: 0 };
            })
    };

    function earned_lost_averager(dimension) {

        return dimension.group().reduce(

            function(p, v) {
                p.count++;
                p.earned += v.earned;
                p.lost += v.lost;
                p.percent = (p.lost / p.earned) * 100;
                return p;
            },

            function(p, v) {
                p.count--;
                if (p.count == 0) {
                    p.leads = 0;
                    p.appts = 0;
                    p.percent = 0;

                }
                else {
                    p.earned -= v.earned;
                    p.lost -= v.lost;
                    p.percent = (p.lost / p.earned) * 100;
                }
                return p;
            },

            function() {
                return { count: 0, earned: 0, lost: 0, percent: 0 };
            })
    };

    var leads_to_appts_by_month = leads_appointments_averager(monthDim);

    var percent_lost_by_month = earned_lost_averager(monthDim);

    var average_earn_by_state = earned_lost_averager(stateDim);


    dc.numberDisplay("#leads-to-appts-by-month") //shows the percentage of leads that are converted to appointments by month
        .formatNumber(d3.format(".0%"))
        .group(leads_to_appts_by_month)
        .valueAccessor(function(d) { return d.value.percent.toFixed(0) / 100; });

    dc.numberDisplay("#percent-lost-by-month") //shows the percentage of revenue lost by month
        .formatNumber(d3.format(".0%"))
        .group(percent_lost_by_month)
        .valueAccessor(function(d) { return d.value.percent.toFixed(0) / 100; });

    dc.barChart("#amount-gained-lost-per-store") //shows the total amount earned by store, by month
        .width(800)
        .height(600)
        .margins({ top: 20, right: 20, bottom: 50, left: 60 })
        .dimension(stateDim)
        .group(average_earn_by_state)
        .valueAccessor(function(d) { return d.value.percent.toFixed(2); })
        .transitionDuration(1000)
        .x(d3.scale.ordinal())
        .colors([barChartColour])
        .y(d3.scale.linear().domain([5000, 26000]))
        .xUnits(dc.units.ordinal)
        .elasticY(false)
        .renderHorizontalGridLines(true)
        .renderTitle(true)
        .title(function(p) {
            return ["Average earned per person in" + " " + p.key + " " + " is" + " " + "$" + p.value.percent.toFixed(2)]
        })
        .xAxisLabel("State")
        .yAxisLabel("Average amount earned per person")
        .yAxis().tickFormat(function(v) {
            return "$" + v;
        });
}
