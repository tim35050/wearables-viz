var selected_applications = [];
var selected_locations = [];
var selected_product;
var selected_product_title;
var selected_arc_obj = null;
var APPLICATION = "application";
var LOCATION = "location";
var show_opacity = 1;
var hide_opacity = 0.15;
var arc_color = "#BBBBBB";
var arc_color_hover = "#999999";
var arc_color_click = "#666666";
var location_dot_radius = 1;
var location_dot_radius_hover = 5;
var location_dot_radius_glow = 3;
var width = 600,
    height = 550,
    radius = Math.min(width, height) / 2;
var innerRadius = radius - 60;
var outerRadius = radius - 30;
var arrow_rect_side = 40;
var arrow_x_translate = width + Math.sqrt(2) * arrow_rect_side / 4;

$( "a" ).click(function() {
    // Find out the type of filter that was clicked from the element's style
    link = $(this);
    change_selection(link);
    if (link_type_is(link, APPLICATION)) {
        change_vitruvian();
    }
    if (link_type_is(link, LOCATION)) {
        change_location_dots();
    }
    apply_filter();
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
        if ((selected_applications.length == 1 && selected_applications[0] == "medical")) {
            fade_in_vitruvian("default");
        } else {
            fade_out_vitruvian("default");
        }
    } else {
        fade_in_vitruvian("default");
    }
    // Always keep medical at the top
    if(selected_applications.indexOf("medical") > -1) {
        fade_in_vitruvian("medical");
    }
}

function change_location_dots() {
    var all_locations = ["body","head","ear","neck","shoulders","back","chest","arm","wrist","hand","fingers","torso","waist","thighs","legs","ankle","feet"];
    for (var i=0; i < selected_locations.length; i++) {
        var location = selected_locations[i];
        all_locations.splice(all_locations.indexOf(location), 1);
        highlight_location_dot(location);
    }
    for (var i=0; i < all_locations.length; i++) {
        unhighlight_location_dot(all_locations[i]);
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
    
    // Move vitruvian to top so that it can detect hover
    vit_svg = $("svg#" + application).detach();
    $("#vitruvians").append(vit_svg);
    
    // Fade it in
    d3.select("svg#" + application)
        .transition()
        .duration(500)
        .attr("opacity",opacity);
}

function highlight_location_dot(location) {
    d3.selectAll("circle." + location)
        .attr("r", location_dot_radius_hover);

    $("circle." + location).each(function() {
        if ($(this).attr("class").indexOf("active") == -1) {
            $(this).attr("class",$(this).attr("class") + " active");
        }
    });
}

function unhighlight_location_dot(location) {
    d3.selectAll("circle." + location).attr("r", function() {
        var applicable_locations = $(this).attr("class").split(" ");
        for (var k=0; k < applicable_locations.length; k++) {
            var applicable_location = applicable_locations[k];
            if (selected_locations.indexOf(applicable_location) > -1) {
                return location_dot_radius_hover;
            }
        }
        return location_dot_radius;
    });

    $("circle." + location).each(function() {
        if ($(this).attr("class").indexOf("active") > -1) {
            $(this).attr("class",$(this).attr("class").replace("active",""));
        }    
    });

}

function apply_filter() {
    var products_percent = 0;
    svg.selectAll(".arc").each(function() {
        g = d3.select(this);
        g.transition()
            .duration(500)
            .attr("opacity", function(d) {
                if ((selected_applications.length == 0) && (selected_locations.length == 0)) {
                    products_percent += 1
                    return show_opacity;
                } else if ((selected_applications.length > 0) && (selected_locations.length == 0)) {
                    for (var i=0; i < selected_applications.length; i++) {
                        var application = selected_applications[i];
                        if (d.domain.toLowerCase().indexOf(application) > -1) {
                            products_percent += 1
                            return show_opacity;
                        }
                    }
                    return hide_opacity;
                } else if ((selected_applications.length == 0) && (selected_locations.length > 0)) {
                    for (var i=0; i < selected_locations.length; i++) {
                        var location = selected_locations[i];
                        if (d.locations.toLowerCase().indexOf(location) > -1) {
                            products_percent += 1
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
                products_percent += 1
                return show_opacity;
            });
    });
    update_products_percent(products_percent);
}

function initialize_vitruvian(application) {
    var opacity = 0;
    if (application == "default") {
        opacity = 0.25;
    }
    svg.select("#" + application)
        .attr("x",87)
        .attr("y",72)
        .attr("width", "450")
        .attr("height", "450")
        .attr("opacity", opacity)
        .on("mouseover", mouseover_vitruvian)
        .on("mouseout", mouseout_vitruvian);

    svg.selectAll("#" + application + " circle")
        .on("mouseover", mouseover_location_dot)
        .on("mouseout", mouseout_location_dot)
        .on("click", click_location_dot);
}


var fisheye_duration = 200;
var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var svg = d3.select("#wheel-viz")
    .attr("width", width)
    .attr("height", height)

// svg.select("#vitruvians")
//     .on("mouseover", mouseover_vitruvian)
//     .on("mouseout", mouseout_vitruvian);

/* Previewed Product */
svg.select("defs").append("path")
        .attr("id","textpath")
        .attr("x",90)
        .attr("stroke","none")
        .attr("fill","none")
        .attr("d","M118.626,269.649c0-99.412,80.588-180,180-180s180,80.588,180,180");

        // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        // .attr("fill","#333333")
        // .attr("class","product-circle")
        // .attr("r",180);

//svg.select("circle.background-circle")
//        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

/* Selected Product */
var div_product = d3.select("div.product-content");

div_product
    .append("div")
        .text("4D Force")
        .attr("class","product-title");

div_product
    .append("a")
        .attr("href","http://google.com")
        .attr("class","product-image")
        .append("div")
            .attr("style","background-image: url('scraped_images/01-glassup.jpg');")
            .attr("class", "product-image");

div_product
    .append("div")
    .attr("class","product-about")
        .append("p")
            .attr("class","product-about")
            .html(get_text_snippet("The 4D Force is a wearable technology that detects brain waves and converts them into electric signals. 4D Force developed a platform that can capture and compute high quality EEG/ EOG/EMG signals. With the device, users can control games by using the power of their thoughts. 4D Force can also be used for medical purposes as it has the ability to interpret electrical signals generated by the body, and create recommendations for changes in lifestyle."));

div_product
    .append("div")
        .attr("class", "product-feature-title")
        .text("Componentry");

div_product
    .append("div")
        .attr("class", "product-componentry product-feature-text")
        .text("Componentry Text");

div_product
    .append("div")
        .attr("class", "product-feature-title")
        .text("Price");

div_product
    .append("div")
        .attr("class", "product-price product-feature-text")
        .text("Price Text");

div_product
    .append("div")
        .attr("class", "product-feature-title")
        .text("Availability");

div_product
    .append("div")
        .attr("class", "product-availability product-feature-text")
        .text("Availability Text");

svg.append("rect")
    .attr("transform","translate(" + String(arrow_x_translate) + ",0) rotate(45)")
    //.attr("y",0)
    .attr("width",arrow_rect_side)
    .attr("height",arrow_rect_side)
    .attr("fill","#666666")
    .attr("class","selected_product_arrow")
    .attr("opacity",0);

initialize_vitruvian("default");
initialize_vitruvian("medical");
initialize_vitruvian("fitness");
initialize_vitruvian("lifestyle");

var myScale = d3.scale.linear().domain([0, 209]).range([0, 2 * Math.PI]);

var arc = d3.svg.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius)
    .startAngle(function(d) {
        return myScale(d.location_id - 1);
    })
    .endAngle(function(d) {
        return myScale(d.location_id);
    });

var selected_arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(innerRadius)
    .startAngle(function(d) {
        return myScale(d.location_id - 1) - 0.01;
    })
    .endAngle(function(d) {
        return myScale(d.location_id) + 0.01;
    });

var clicked_arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(innerRadius)
    .startAngle(function(d) {
        return myScale(d.location_id - 1) - 0.06;
    })
    .endAngle(function(d) {
        return myScale(d.location_id) + 0.06;
    });

svg = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .attr("class","arcs");

d3.csv("products_modified_rev2.csv", function(error, data) {

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

    enable_default_selections();

});

function get_text_snippet(text) {
    return text.substring(0,220) + "...";
}

function mouseover_path(d) {
    obj_this = d3.select(this)
    corrected_opacity = Math.round(obj_this.attr("opacity")*100) / 100;
    if ( (corrected_opacity != hide_opacity) && (d.id != selected_product) ) {
        show_product_title(d.title);
        highlight_body_location(d);
        path_obj = get_path_from_group(this);
        path_obj
            .style("fill",arc_color_hover)
            .transition()
            .ease("sin-out")
            .duration(fisheye_duration)
            .attr("d", selected_arc);

        // Move clicked arc to top
        detached_path = $(this).detach();
        $("g.arcs").append(detached_path);      
        // Move to second place to not be hidden behind clicked
        //detached_path.insertAfter($("g.arcs").children()[0]);
    }
}

function mouseout_path(d) {
    unhighlight_body_locations();
    d3.select("use").remove();
    d3.select("text.hover-title").remove();

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
        handle_path_click(this,product);
    }
}

function handle_path_click(g,product) {
    selected_product = product.id;
    selected_product_title = product.title;
    path_obj = get_path_from_group(g);
    selected_arc_obj = path_obj;
    path_obj.transition()
            .duration(200)
            .style("fill", arc_color_click)
            .attr("d", clicked_arc);

    d3.select(g)
        .append("text")
        .attr("text-anchor","middle")
        .attr("stroke","#FFFFFF")
        .attr("class","close-tab")
        .text("close")
        .attr("transform", function(d) {
            startAngle = myScale(d.location_id - 1) - 0.06;
            endAngle = myScale(d.location_id) + 0.06;
            d.angle = (startAngle + endAngle) / 2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + " translate(" + (innerRadius + 45) + ")" + ((d.angle > Math.PI / 2) && (d.angle < 3 * Math.PI / 2) ? "rotate(270)" : " rotate(90)");
        })
        .attr("text-anchor", function(d) {
            return d.angle > Math.PI ? "middle" : "middle";
        });
    
    // Move clicked arc to bottom
    detached_path = $(g).detach();
    $("g.arcs").prepend(detached_path);

    show_product(product);
}

function mouseover_vitruvian(d) {
    if (d3.select(this).attr("opacity") > 0) {
        d3.select(this).selectAll("circle")
            .transition()
            .duration(200)
            .ease("cubic")
            .attr("r", function(d) {
                if ($(this).attr("r") != location_dot_radius_hover) {
                    return location_dot_radius_glow;
                } else {
                    return $(this).attr("r");
                }
            });
    }
}

function mouseout_vitruvian(d) {
    d3.select(this).selectAll("circle")
        .transition()
        .duration(200)
        .ease("cubic")
        .attr("r", function(d) {
            if ($(this).attr("class").indexOf("active") == -1) {
                return location_dot_radius;    
            } else {
                return location_dot_radius_hover;
            }
            
        });
}

function mouseover_location_dot(d) {
    d3.select(this)
        .attr("r",location_dot_radius_hover);
}

function mouseout_location_dot(d) {
    if ($(this).attr("class").indexOf("active") == -1) {
        // This dot is inactive (it was just unclicked),
        // so we can reduce its size
        d3.select(this)
            .attr("r",location_dot_radius_glow);
    }
}

function click_location_dot(d) {
    if ($(this).attr("class").indexOf("active") > -1) {
        d3.select(this).attr("class",$(this).attr("class").replace(" active",""));
    } else {
        d3.select(this).attr("class",$(this).attr("class") + " active")
    }
    var locations = $(this).attr("class");
    $('ul#locations li a').each(function() {
        var atext = $(this).html().toLowerCase();
        if (locations.indexOf(atext) > -1) {
            // Enable this link, but first check if it's already enabled
            if ($(this).attr("class").indexOf("active") == -1) {
                $(this).addClass($(this).attr("class") + " active");
                selected_locations.push(atext); 
            } else {
                // Link already enabled, so we're trying to disable
                $(this).removeClass("active");
                selected_locations.splice(selected_locations.indexOf(atext), 1);
            }
        }
    });
    apply_filter();
    change_location_dots();
    // if (link_is_selected(link)) {
    //     link.removeClass("active");
    //     selected_links.splice(selected_links.indexOf(link_content), 1);
    // } else {
    //     link.addClass(link.attr("class") + " active");
    //     selected_links.push(link_content);
    // }
}

function get_path_from_group(group) {
    /* Don't think D3 shape stores siblings, so fisheye may be tough */
    obj_this = d3.select(group)
    path = obj_this[0][0].children;
    path_obj = d3.select(path[0]);
    return path_obj;
}
function show_product_title(title) {
    d3.select("#wheel-viz")
        .append("use").attr("xlink:href","#textpath");
    d3.select("#wheel-viz")
        .append("text").attr("x",0).attr("y",100).attr("class","product-title hover-title").attr("text-anchor", "middle")
        .append("textPath").attr("xlink:href","#textpath").attr("startOffset","50%")
        .html(title);
}
function highlight_body_location(d) {
    var split_locations = d.locations.split(",");
    for (var i = 0; i < split_locations.length; i++) {
        var product_location = split_locations[i].toLowerCase();
        // Ignore locations that are more than one word
        if (product_location.split(" ").length == 1) {
            d3.selectAll("circle." + product_location)
                .transition()
                .duration(200)
                .attr("r", location_dot_radius_hover);
        }
    }
}
function unhighlight_body_locations() {
    d3.selectAll("svg.vitruvian circle")
        .transition()
        .duration(200)
        .attr("r", function() {
            if ($(this).attr("class").indexOf("active") > -1) {
                return location_dot_radius_hover;
            } else {
                return location_dot_radius;    
            }
        });
}
function hide_product() {
    if (selected_arc_obj != null) {
        selected_arc_obj
            .style("fill",arc_color)
            .transition()
            .ease("sin-out")
            .duration(fisheye_duration)
            .attr("d", arc);
        // Remove "close" text
        $(selected_arc_obj[0][0]).siblings().remove();
        transition_arrow(null);
        $(".product-content").hide();
        $(".product-default").show();
    }

    //selected_product = 0;
    selected_product_title = "";
}
function show_product(product) {
    $(".product-content").show();
    $(".product-default").hide();

    div_product
        .select("div.product-title")
            .text(product.title);

    if (product.image_name != "") {
        div_product
            .select("a.product-image")
                .attr("href",product.network.split(",")[0]);

        div_product
            .select("div.product-image")
                .attr("style","background-image: url('scraped_images/" + product.image_name + "');");
    }

    var p = div_product.select("p.product-about")[0][0]
    d3.select(p).html(get_text_snippet(product.about));

    div_product
        .select("div.product-componentry")
            .text(product.componentry.split(",").join(", "));
    div_product
        .select("div.product-price")
            .text(product.price);

    div_product
        .select("div.product-availability")
            .text(product.consumer_release);

    transition_arrow(product);

}

function transition_arrow(product) {
    if (product == null) {
        // Product unselected - fade out arrow.
        d3.select("rect").transition().duration(200).attr("opacity",0);
    } else {
        // cos(theta) = adjacent/hypotenuse
        // theta = product angle
        // adjacent = indicator of y-position of arrow
        // hypotenuse = circle radius
        startAngle = myScale(product.location_id - 1) - 0.06;
        endAngle = myScale(product.location_id) + 0.06;
        var angle = (startAngle + endAngle) / 2;
        var y_indicator = Math.cos(angle) * outerRadius;
        var y = height / 2 - y_indicator - arrow_rect_side * Math.sqrt(2) / 2;
        d3.select("rect")
            .transition()
            .duration(300)
            .attr("transform","translate(" + String(arrow_x_translate) + "," + String(y) + ") rotate(45)")
            .attr("opacity",1);

        console.log(d3.select("rect").attr("transform"));
    }
}

function update_products_percent(num_selected) {
    var percent_selected_products = num_selected / parseFloat(209) * 100;
    percent_selected_products = Math.round(percent_selected_products * 10) / 10;
    $('#percent-products').fadeIn().html(percent_selected_products.toString() + "%");
}

function enable_default_selections() {
    selected_applications.push("fitness");
    selected_applications.push("lifestyle");
    selected_applications.push("medical");
    change_vitruvian();
    apply_filter();

    d3.selectAll(".arc").each(function(d) {
        if (d.id == 98) {
            handle_path_click(this,d);
        }
    });
}