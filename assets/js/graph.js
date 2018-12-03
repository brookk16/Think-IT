queue()
    .defer(d3.csv, "data/sales-data.csv")
    .await(makeGraphs);



function makeGraphs(error, salesData) {
    var ndx = crossfilter(salesData);

    salesData.forEach(function(d) {
        d.earned = parseInt(d.earned);
        d.lost = parseInt(d.lost);
        d.leads = parseInt(d.leads);
        d.appointments = parseInt(d.appointments);
    })

    show_store_location_selector(ndx);
    show_grand_totals(ndx);
    show_amount_earned_per_store(ndx);
    show_percent_lost(ndx);
    show_leads_and_appts_per_store(ndx);
    show_number_display_leads_and_appts(ndx);
    

    dc.renderAll();

}

function show_store_location_selector(ndx) {
    var stateDim = ndx.dimension(dc.pluck("store_location"));
    var stateGroup = stateDim.group();

    dc.selectMenu("#store-location-selector")
        .dimension(stateDim)
        .group(stateGroup);
}

function show_grand_totals(ndx) {

    var monthDim = ndx.dimension(dc.pluck("month"));

    var earn_by_month = monthDim.group().reduceSum(dc.pluck("earned"));

    dc.numberDisplay("#earn-by-month")
        .formatNumber(d3.format(".2"))
        .group(earn_by_month);

    var lost_by_month = monthDim.group().reduceSum(dc.pluck("lost"));

    dc.numberDisplay("#lost-by-month")
        .formatNumber(d3.format(".2"))
        .group(lost_by_month);

    var leads_by_month = monthDim.group().reduceSum(dc.pluck("leads"));

    dc.numberDisplay("#leads-by-month")
        .formatNumber(d3.format(".2"))
        .group(leads_by_month);

    var appts_by_month = monthDim.group().reduceSum(dc.pluck("appointments"));

    dc.numberDisplay("#appts-by-month")
        .formatNumber(d3.format(".2"))
        .group(appts_by_month);

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

    dc.numberDisplay("#leads-to-appts-by-month")
        .formatNumber(d3.format(".0%"))
        .group(leads_to_appts_by_month)
        .valueAccessor(function(d) { return d.value.percent.toFixed(0) / 100; })

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

    dc.numberDisplay("#percent-lost-by-month")
        .formatNumber(d3.format(".0%"))
        .group(percent_lost_by_month)
        .valueAccessor(function(d) { return d.value.total.toFixed(0) / 100; })

}

function show_amount_earned_per_store(ndx) {

    var stateDim = ndx.dimension(dc.pluck("store_location"));

    var average_earn_by_state = stateDim.group().reduce(
        function add_item(p, v) {
            p.count++;
            p.total += v.earned - v.lost;
            p.average = p.total / p.count;
            return p;
        },

        function remove_item(p, v) {
            p.count--;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
            }
            else {
                p.total -= v.earned - v.lost;
                p.average = p.total / p.count;
            }
            return p;
        },

        function initialise() {
            return { count: 0, total: 0, average: 0 };
        });


    dc.barChart("#amount-gained-lost-per-store")
        .width(800)
        .height(600)
        .margins({ top: 20, right: 20, bottom: 50, left: 60 })
        .dimension(stateDim)
        .group(average_earn_by_state)
        .valueAccessor(function(d) { return d.value.average.toFixed(2); })
        .transitionDuration(1000)
        .x(d3.scale.ordinal())
        .colors(['red'])
        .y(d3.scale.linear().domain([5000, 26000]))
        .xUnits(dc.units.ordinal)
        .elasticY(false)
        .renderHorizontalGridLines(true)
        .renderTitle(true)
        .title(function(p) {
            return ["Total earnt per person in" + " " + p.key + " " + " is" + " " + "$" + p.value.average.toFixed(2)]
        })
        .xAxisLabel("State")
        .yAxisLabel("Average amount earned per person")
        .yAxis().tickFormat(function(v) {
            return "$" + v;
        })
}

function show_percent_lost(ndx) { 

    var stateDim = ndx.dimension(dc.pluck("store_location"));

    var percent_lost = stateDim.group().reduce(
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
                p.total = 0;
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
        
    dc.pieChart("#percent-lost")
        .width(400)
        .height(400)
        .radius(100)
        .dimension(stateDim)
        .group(percent_lost)
        .valueAccessor(function(d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                return d.value.total.toFixed(0);
            }
        })
        .innerRadius(40)
        .externalLabels(50)
        .transitionDuration(1000)
        .colorAccessor(function(d) {
            if (d.value.total > 25) {
                return "above_threshold";
            }
            else {
                return "below_threshold";
            }
        })
        .colors(d3.scale.ordinal().domain(["above_threshold", "below_threshold"])
            .range(["#c80e0e", "#4db50f"]))
        .minAngleForLabel(0);
}

function show_leads_and_appts_per_store(ndx) {

    var stateDim = ndx.dimension(dc.pluck("store_location"));

    var leadsPerState = stateDim.group().reduceSum(dc.pluck("leads"));

    var apptsPerState = stateDim.group().reduceSum(dc.pluck("appointments"));

    dc.barChart("#leads-and-appts-per-store")
        .width(800)
        .height(500)
        .margins({ top: 30, right: 160, bottom: 50, left: 50 })
        .dimension(stateDim)
        .group(leadsPerState, "Total leads")
        .stack(apptsPerState, "Total appointments")
        .legend(dc.legend().x(670).y(280).itemHeight(10).gap(5))
        .transitionDuration(1000)
        .x(d3.scale.ordinal())
        .ordinalColors(['red', 'green'])
        .y(d3.scale.linear().domain([5000, 26000]))
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .title(function(p) {
            return ["Total generated in" + " " + p.key + " " + " is" + " " + p.value]
        })
        .xAxisLabel("State")
        .yAxisLabel("Leads and appointments generated")
        .yAxis().tickFormat(function(v) {
            return v;
        });
}

function show_number_display_leads_and_appts(ndx) { 

    var stateDim = ndx.dimension(dc.pluck("store_location"));

    var leads_to_appts = stateDim.group().reduce(
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



    dc.pieChart("#leads-to-appts")
        .width(400)
        .height(400)
        .radius(100)
        .dimension(stateDim)
        .group(leads_to_appts)
        .valueAccessor(function(d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                return d.value.percent;
            }
        })
        .innerRadius(40)
        .externalLabels(40)
        .title(function(p) {
            return ["Average leads to appointments in" + " " + p.key + " " + " is" + " " + p.value.percent.toFixed(0) + "%"]
        })
        .transitionDuration(1000)
        .colorAccessor(function(d) {
            if (d.value.percent < 40) {
                return "above_threshold";
            }
            else {
                return "below_threshold";
            }

        })
        .colors(d3.scale.ordinal().domain(["above_threshold", "below_threshold"])
            .range(["#c80e0e", "#4db50f"]))
        .minAngleForLabel(0);
}

