
/* Stuff related to filtering menu */

var selected_applications = [];
var APPLICATION = "application";
var LOCATION = "location";

$( "a" ).click(function() {
    // Find out the type of filter that was clicked from the element's style
    link = $(this);
    change_selection(link);
    //change_vitruvian(link);
    if (link_type_is(link, APPLICATION)) {
        apply_filter(APPLICATION);
    } else {
        apply_fiter(LOCATION);
    }
});

function link_type_is(link,filter) {
    return link.attr("class").indexOf(filter) > -1;
}
function link_is_selected(link) {
    link_content = link.html();
    return selected_links.indexOf(link_content) > -1;
}
function change_selection(link) {
    link_content = link.html();
    selected_links = [];
    if (link_type_is(link, APPLICATION)) {
        selected_links = selected_applications;
    } else {
        //selected_links = selected_positions;
    }
    if (link_is_selected(link)) {
        link.removeClass("active");
        selected_links.splice(selected_links.indexOf(link_content), 1);
    } else {
        link.addClass(link.attr("class") + " active");
        selected_links.push(link_content);
    }
}
function change_vitruvian(link) {
    img_url = "";
    application = link.html().toLowerCase();
    selected_links = [];
    if (link_type_is(link, APPLICATION)) {
        selected_links = selected_applications;
    }
    if (selected_links.length == 0) {
        application = "default";
    }
    //fade_out_old_image();
    fade_in_new_image(application);
}

function fade_out_old_image(application) {
    d3.select("svg").select("img")
        .transition()
        .duration(1000)
        .style("display","none");
}

function fade_in_new_image(application) {
    d3.select("svg").select("img." + application)
        .transition()
        .duration(1000)
        .style("display","block");
}
function apply_filter(filter_type) {
    svg.selectAll(".arc").each(function() {
        g = d3.select(this);
        g.transition()
            .duration(500)
            .attr("opacity", function(d) {
                if (filter_type == APPLICATION) {
                    selected_links = selected_applications
                    column = d.primary_applications;
                }
                if (selected_links.length == 0) {
                    return 1;
                } else {
                    show_product = false;
                    for (var i=0; i < selected_links.length; i++) {
                        var application = selected_links[i];
                        if (column.indexOf(application) > -1) {
                            show_product = true;
                        }
                    }   
                    if (show_product) {
                        return 1;
                    } else {
                        return 0.15;
                    }
                }
            });
    });
}
function initialize_vitruvian(application) {
    svg.select("#" + application)
        .attr("x",117)
        .attr("y",72)
        .attr("width", "450")
        .attr("height", "450")
        .attr("opacity",0.5);
}

var width = 660,
    height = 550,
    radius = Math.min(width, height) / 2;
/* Animation Variables */
var fisheye_duration = 200;
var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var svg = d3.select("#wheel-viz")
    .attr("width", width)
    .attr("height", height)

initialize_vitruvian("default");
initialize_vitruvian("fitness");
initialize_vitruvian("lifestyle");

var myScale = d3.scale.linear().domain([0, 209]).range([0, 2 * Math.PI]);

var arc = d3.svg.arc()
    .outerRadius(radius - 20)
    .innerRadius(radius - 60)
    .startAngle(function(d) {
        return myScale(d.id - 1);
    })
    .endAngle(function(d) {
        return myScale(d.id);
    });

var selected_arc = d3.svg.arc()
    .outerRadius(radius - 5)
    .innerRadius(radius - 60)
    .startAngle(function(d) {
        return myScale(d.id - 1) - 0.01;
    })
    .endAngle(function(d) {
        return myScale(d.id);
    });

svg = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("products.csv", function(error, data) {

    var g = svg.selectAll(".arc")
        .data(data)
        .enter().append("g")
        .attr("class", "arc")
        .on("mouseover", mouseover_path)
        .on("mouseout", mouseout_path);

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(0); } );

    g.append("text")
          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .text(function(d) { return d.id; });

});

function mouseover_path(d) {
    path_obj = get_path_from_group(this);
    path_obj.transition()
            .ease("sin-out")
            .duration(fisheye_duration)
            .attr("d", selected_arc);
}

function mouseout_path(d) {
    path_obj = get_path_from_group(this);
    path_obj.transition()
            .ease("sin-out")
            .duration(fisheye_duration)
            .attr("d", arc);
}

function get_path_from_group(group) {
    /* Don't think D3 shape stores siblings, so fisheye may be tough */
    obj_this = d3.select(group)
    path = obj_this[0][0].children;
    path_obj = d3.select(path[0]);
    return path_obj;
}