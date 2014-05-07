var selected_applications = [];
var selected_locations = [];
var selected_product;
var selected_arc_obj = null;
var APPLICATION = "application";
var LOCATION = "location";
var show_opacity = 1;
var hide_opacity = 0.15;
var arc_color = "#BBBBBB";
var arc_color_hover = "#999999";
var arc_color_click = "#666666";

$( "a" ).click(function() {
    // Find out the type of filter that was clicked from the element's style
    link = $(this);
    change_selection(link);
    if (link_type_is(link, APPLICATION)) {
        change_vitruvian();
        apply_filter(APPLICATION);
    } else {
        apply_filter(LOCATION);
    }
});

function link_type_is(link,filter) {
    return link.attr("class").indexOf(filter) > -1;
}

function link_is_selected(link) {
    link_content = link.html().toLowerCase();
    return selected_links.indexOf(link_content) > -1;
}

function change_selection(link) {
    link_content = link.html().toLowerCase();
    selected_links = [];
    if (link_type_is(link, APPLICATION)) {
        selected_links = selected_applications;
    } else {
        selected_links = selected_locations;
    }
    if (link_is_selected(link)) {
        link.removeClass("active");
        selected_links.splice(selected_links.indexOf(link_content), 1);
    } else {
        link.addClass(link.attr("class") + " active");
        selected_links.push(link_content);
    }
}

function change_vitruvian() {
    var all_applications = ["fitness","lifestyle","medical"];
    for (var i=0; i < selected_applications.length; i++) {
        var application = selected_applications[i];
        all_applications.splice(all_applications.indexOf(application), 1);
        fade_in_vitruvian(application);
    }
    for (var i=0; i < all_applications.length; i++) {
        fade_out_vitruvian(all_applications[i]);
    }
    if (selected_applications.length > 0) {
        fade_out_vitruvian("default");
    } else {
        fade_in_vitruvian("default");
    }
}

function fade_out_vitruvian(application) {
    d3.select("svg").select("svg#" + application)
        .transition()
        .duration(500)
        .attr("opacity",0);
}

function fade_in_vitruvian(application) {
    var opacity = 0.5;
    if (application == "default") {
        opacity = 0.25;
    }
    d3.select("svg").select("svg#" + application)
        .transition()
        .duration(500)
        .attr("opacity",opacity);
}

function apply_filter(filter_type) {
    svg.selectAll(".arc").each(function() {
        g = d3.select(this);
        g.transition()
            .duration(500)
            .attr("opacity", function(d) {
                if ((selected_applications.length == 0) && (selected_locations.length == 0)) {
                    return show_opacity;
                } else if ((selected_applications.length > 0) && (selected_locations.length == 0)) {
                    for (var i=0; i < selected_applications.length; i++) {
                        var application = selected_applications[i];
                        if (d.domain.toLowerCase().indexOf(application) > -1) {
                            return show_opacity;
                        }
                    }
                    return hide_opacity;
                } else if ((selected_applications.length == 0) && (selected_locations.length > 0)) {
                    for (var i=0; i < selected_locations.length; i++) {
                        var location = selected_locations[i];
                        if (d.locations.toLowerCase().indexOf(location) > -1) {
                            return show_opacity;
                        }
                    }
                    return hide_opacity;
                } else {
                    is_filtered = true;
                    for (var i=0; i < selected_applications.length; i++) {
                        var application = selected_applications[i];
                        if (d.domain.toLowerCase().indexOf(application) > -1) {
                            is_filtered = false;
                        }
                    }
                    if (is_filtered) {
                        return hide_opacity;
                    }
                    is_filtered = true;
                    for (var i=0; i < selected_locations.length; i++) {
                        var location = selected_locations[i];
                        if (d.locations.toLowerCase().indexOf(location) > -1) {
                            is_filtered = false;
                        }
                    }
                    if (is_filtered) {
                        return hide_opacity;
                    }
                }
                return show_opacity;
            });
    });
}

function initialize_vitruvian(application) {
    var opacity = 0;
    if (application == "default") {
        opacity = 0.25;
    }
    svg.select("#" + application)
        .attr("x",117)
        .attr("y",72)
        .attr("width", "450")
        .attr("height", "450")
        .attr("opacity",opacity);
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

var g_product = svg.append("g")
    .attr("class","product")
    .attr("opacity",0);

g_product.append("circle")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr("fill","#FFFFFF")
        .attr("class","product-circle")
        .attr("r",210);

g_product
    .append("text")
        .attr("y",-120)
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .text("4D Force")
        .attr("class","product-title");

g_product
    .append("image")
        .attr("y", -240)
        .attr("xlink:href", "/scraped_images/01-glassup.jpg")
        .attr("src", "/scraped_images/01-glassup.jpg")
        .attr("width", 480)
        .attr("height", 480)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + "),scale(0.4)")
        .attr("class", "product-image");

g_product
    .append("text")
        .attr("y",-80)
        .attr("text-anchor", "end")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr("class","product-about")
        .each(function (d) {
            var sample_text = "The 4D Force is a wearable technology that detects brain waves and converts them into electric signals. 4D Force developed a platform that can capture and compute high quality EEG/ EOG/EMG signals. With the device, users can control games by using the power of their thoughts. 4D Force can also be used for medical purposes as it has the ability to interpret electrical signals generated by the body, and create recommendations for changes in lifestyle.";
            var lines = wordwrap(get_text_snippet(sample_text), 30)
            for (var i = 0; i < lines.length; i++) {
                d3.select(this).append("tspan").attr("dy",18).attr("x",-10).text(lines[i])
            }
        });

initialize_vitruvian("default");
initialize_vitruvian("medical");
initialize_vitruvian("fitness");
initialize_vitruvian("lifestyle");

var myScale = d3.scale.linear().domain([0, 209]).range([0, 2 * Math.PI]);

var arc = d3.svg.arc()
    .outerRadius(radius - 20)
    .innerRadius(radius - 60)
    .startAngle(function(d) {
        return myScale(d.location_id - 1);
    })
    .endAngle(function(d) {
        return myScale(d.location_id);
    });

var selected_arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - 60)
    .startAngle(function(d) {
        return myScale(d.location_id - 1) - 0.01;
    })
    .endAngle(function(d) {
        return myScale(d.location_id);
    });

svg = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("products_modified.csv", function(error, data) {

    var g = svg.selectAll(".arc")
        .data(data)
        .enter().append("g")
        .attr("class", "arc")
        .on("mouseover", mouseover_path)
        .on("mouseout", mouseout_path)
        .on("click", click_path);

    g.append("path")
        .attr("d", arc)
        .style("fill", arc_color);

});

function wordwrap(text, max) {
    var regex = new RegExp(".{0,"+max+"}(?:\\s|$)","g");
    var lines = []

    var line
    while ((line = regex.exec(text))!="") {
        lines.push(line);
    } 

    return lines
}

function get_text_snippet(text) {
    return text.substring(0,220) + "...";
}

function mouseover_path(d) {
    path_obj = get_path_from_group(this);
    obj_this = d3.select(this)
    if ( (obj_this.attr("opacity") != hide_opacity) && (d.id != selected_product) ) {
        path_obj
                .style("fill",arc_color_hover)
                .transition()
                .ease("sin-out")
                .duration(fisheye_duration)
                .attr("d", selected_arc);        
    }
}

function mouseout_path(d) {
    if (d.id != selected_product) {
        path_obj = get_path_from_group(this);
        path_obj
            .style("fill", arc_color)
            .transition()
            .ease("sin-out")
            .duration(fisheye_duration)
            .attr("d", arc);
    }
}

function click_path(product) {
    hide_product();
    // Make sure you're not re-showing an un-selected product
    if (selected_product != product.id) {
        selected_product = product.id;
        path_obj = get_path_from_group(this);
        selected_arc_obj = path_obj;
        path_obj.transition()
                .duration(200)
                .style("fill", arc_color_click);
        show_product(product);
    }
}

function get_path_from_group(group) {
    /* Don't think D3 shape stores siblings, so fisheye may be tough */
    obj_this = d3.select(group)
    path = obj_this[0][0].children;
    path_obj = d3.select(path[0]);
    return path_obj;
}
function hide_product() {
    if (selected_arc_obj != null) {
        selected_arc_obj
            .style("fill",arc_color)
            .transition()
            .ease("sin-out")
            .duration(fisheye_duration)
            .attr("d", arc);        
    }
    g_product = d3.select("g.product")
        .transition()
        .duration(500)
        .attr("opacity",0);
}
function show_product(product) {
    console.log("yo");
    g_product = d3.select("g.product")
        .transition()
        .duration(500)
        .attr("opacity",1);

    g_product
        .select("text.product-title")
            .text(product.title);

    if (product.image_name != "") {
        g_product
            .select("image")
                .attr("xlink:href", "/scraped_images/" + product.image_name)
                .attr("src", "/scraped_images/" + product.image_name);        
    }

    g_product
        .select("text.product-about")
            .each(function(d) {
                d3.select(this).selectAll("tspan")
                    .attr("opacity",0).remove();

                var sample_text = product.about;
                var lines = wordwrap(get_text_snippet(sample_text), 30);
                for (var i = 0; i < lines.length; i++) {
                    d3.select(this).append("tspan").attr("dy",18).attr("x",-10).text(lines[i]);
                }
            });
}