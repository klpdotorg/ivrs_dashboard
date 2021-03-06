String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

$(document).ready(function () {

  $(".menu-data-type").click(function(e) {
    $(".sub-sections-list li").removeClass("active");
    $(this).parent("li").addClass("active");

    if ($(this).attr("id") === "s") {
      $("#school").trigger("click");
    }else {
      $("#pre-school").trigger("click");
    }
    e.preventDefault();
  });

  $('.tabs ul.tabs-nav li').click(function () {
    var tab_id = $(this).attr('data-tab');
    $('.tabs ul.tabs-nav li').removeClass('current');
    $('.tabs .tabs-content').removeClass('current');
    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
    var i_id = $(this).attr("id");

    if (i_id === "pre-school") {
      $("#block-select").html('Project');
      $("#cluster-select").html('Circle');
      $("#table-block-header").html('Project');
      $("#table-cluster-header").html('Circle');
      blockDataByGenre("preschool");
      $("#question5s").hide();
      $("#question5").show();

      $("#type_A").show();
      $("#type").hide();
      dc.filterAll();
      dc.redrawAll();

    }else {
      $("#block-select").html('Block');
      $("#cluster-select").html('Cluster');
      $("#table-block-header").html('Block');
      $("#table-cluster-header").html('Cluster');
      $("#question5s").show();
      $("#question5").hide();
      $("#type_A").hide();
      $("#type").show();

      blockDataByGenre("school");
      dc.filterAll();
      dc.redrawAll();

    }
  });

  function blockDataByGenre(params) {
    var tmp_arr = [];
    var html_template = '<option value="select_block">Select none</option>';

    for(i in ruby_data) {
      var rdata = ruby_data[i];
      if (rdata.genre == params && tmp_arr.indexOf(rdata.blocks) < 0) {
        //html_template += '<option value="'+rdata.blocks+'">'+rdata.blocks.toProperCase()+'</option>';
        tmp_arr.push(rdata.blocks);
      }
    }

    tmp_arr.sort(alphabetical);

    for(i in tmp_arr) {
      html_template += '<option value="'+tmp_arr[i]+'">'+tmp_arr[i].toProperCase()+'</option>';
    }

    $("#listBlocksChosen").html(html_template);
    dc.redrawAll();
  }

  function blockDataByState(genre,state) {

    var tmp_arr = new Array();
    var html_template = '<option value="select_block">Select none</option>';

    for(i in ruby_data) {
      var rdata = ruby_data[i];
      if (rdata.genre == genre && tmp_arr.indexOf(rdata.blocks) < 0 && rdata.district.toLowerCase() === state) {
        tmp_arr.push(rdata.blocks);
      }
    }

    for(i in tmp_arr) {
      html_template += '<option value="'+tmp_arr[i]+'">'+tmp_arr[i].toProperCase()+'</option>';
    }

    $("#listBlocksChosen").html(html_template);
    dc.redrawAll();
  }

  $("#listBlocksChosen").change(function (d) {
    var c_block = $(this).val();
    var tmp_arr = [];
    for(i in ruby_data) {
      var rblock = ruby_data[i].blocks;
      if (rblock === c_block && tmp_arr.indexOf(ruby_data[i].clusters) < 0) {
        tmp_arr.push(ruby_data[i].clusters);
      }
    }

    tmp_arr.sort(alphabetical);

    var tmp_template = '<option value="select_cluster">Select none</option>';
    for(i in tmp_arr) {
      tmp_template += '<option value="'+tmp_arr[i]+'">'+tmp_arr[i].toProperCase()+'</option>';
    }

    $("#listClustersChosen").html(tmp_template)

  });

//  $(document).on('click', '#map path', function (e) {
//    var state = $(this).attr("data-state");
//    var genre = $('.tabs ul.tabs-nav li.current').attr("id");
//    blockDataByState(genre,state);
//  });

});

function dashboardChartInit(data,all_questions) {

  var numResponsesChart = dc.barChart("#bar-chart");
  var responsesChartWidth = $("#bar-chart").width();
  var choroplethChart = dc.geoChoroplethChart("#map");
  var schoolTypeChart = dc.rowChart("#type");
  var schoolType_AChart = dc.rowChart("#type_A");
  var question1Chart = dc.rowChart("#question1");
  var question2Chart = dc.rowChart("#question2");
  var question3Chart = dc.rowChart("#question3");
  var question4Chart = dc.rowChart("#question4");
  var question5Chart = dc.rowChart("#question5");
  var question5sChart = dc.rowChart("#question5s");
  var question6Chart = dc.rowChart("#question6");
  var dataTable = dc.dataTable("#response-list");

  // Let's have a date object for each record from the individual date fields
  data.forEach(function (d, i) {
    d.date = new Date(d.years, d.months - 1, d.dates);
  });


  // A nest operator, for grouping the responses to questions
  var nestByDistrict = d3.nest()
  .key(function (d) {
    return d.district;
  });

  // Create the crossfilter for the relevant dimensions and groups
  var questionaire = crossfilter(data),
  all = questionaire.groupAll(),
  id = questionaire.dimension(function (d) {
    return d.id;
  }),
  district = questionaire.dimension(function (d) {
    return d.district;
  }),
  blocks = questionaire.dimension(function (d) {
    return d.blocks;
  }),
  clusters = questionaire.dimension(function (d) {
    return d.clusters;
  }),
  genre = questionaire.dimension(function (d) {
    return d.genre;
  }),
  types_S = questionaire.dimension(function (d) {
    if (d.genre == "school" && (d.types == "Upper Primary" || d.types == "Model Primary" || d.types == "Lower Primary")) {
      return d.types;
    }
  }),
  types_A = questionaire.dimension(function (d) {
    if (d.genre !== "school" && (d.types !== "Upper Primary" || d.types !== "Model Primary" || d.types !== "Lower Primary")) {
      return d.types;
    }else {
      return "";
    }
  }),
  school_name = questionaire.dimension(function (d) {
    return d.school_name;
  }),
  mobile_no = questionaire.dimension(function (d) {
    return d.mobile_no;
  }),
  date = questionaire.dimension(function (d) {
    return d.date;
  }),
  question1 = questionaire.dimension(function (d) {
    return d.question1;
  }),
  question2 = questionaire.dimension(function (d) {
    return d.question2;
  }),
  question3 = questionaire.dimension(function (d) {
    return d.question3;
  }),
  question4 = questionaire.dimension(function (d) {
    return d.question4;
  }),
  question5 = questionaire.dimension(function (d) {
    return d.range;
  }),
  question5s = questionaire.dimension(function (d) {
    if (d.genre == "school") {
      if (d.question5 < 2) {
        return d.question5;
      }else {
        return 0;
      }
      return d.question5;
    }else {
      return 0;
    }

  }),
  question6 = questionaire.dimension(function (d) {
    return d.question6;
  });

  // Get the count of facts
  schoolGroup = types_S.group();
  pschoolgroup = types_A.group();
  numResponsesGroup = date.group(d3.time.month),
  q1Group = question1.group();
  q2Group = question2.group();
  q3Group = question3.group();
  q4Group = question4.group();
  q5Group = question5.group();
  q5sGroup = question5s.group();
  q6Group = question6.group();
  districtGroup = district.group();
  genreGroup = district.group();

  var blockGroup = blocks.group();
  var clusterGroup = clusters.group();

  // Show onlly pre-school data initially
  genre.filter("school");
  getQuestionNameByGenre("Schools");

  // Get unique list of blocks
  var listBlocksSorted = blockGroup.all()
  .sort(function (a, b) {
    return a.key === b.key ? 0 : a.key < b.key ? -1 : 1;
  })
  .map(function (a) {
    return a.key;
  });
  // Get unique list of clusters
  var listClustersSorted = clusterGroup.all()
  .sort(function (a, b) {
    return a.key === b.key ? 0 : a.key < b.key ? -1 : 1;
  })
  .map(function (a) {
    return a.key;
  });

  // Create another dimension which the selected dropdown value will be applied to
  var filterBlocks = questionaire.dimension(function (d) {
    return d.blocks;
  });
  var filterClusters = questionaire.dimension(function (d) {
    return d.clusters;
  });

  // Show only pre-school data
  $("#pre-school").click(function () {
    genre.filterAll();
    genre.filter("preschool");
    dc.redrawAll();
    getQuestionNameByGenre("Preschools");
    $("#type svg").attr("height",150);
    window.genre = "preschool";
//    schoolTypeChart.height(150);
    $(".dc-legend").css("visibility","hidden");

    $("#num_response_yest_n").html(stat_value['pre_yest']);
    $("#num_response_this_week_n").html(stat_value['pre_count']);

  });

  // Show only school data
  $("#school").click(function () {
    genre.filterAll();
    genre.filter("school");
    dc.redrawAll();
    getQuestionNameByGenre("Schools");
    //$("#type svg").attr("height",275);
    $(".dc-legend").css("visibility","visibile");
    $("#num_response_yest_n").html(stat_value['sch_yest']);
    $("#num_response_this_week_n").html(stat_value['sch_count']);

  });


  // Fill Block dropdown
  // Get sorted values
//  var select_box_options = listBlocksSorted;
//  select_box_options.sort(alphabetical);
//  // Target the select dropdown to be filled with options
//  var sel = document.getElementById('listBlocksChosen');
//  // For each block in the list, create an option
//  for(var i = 0; i < select_box_options.length; ++i) {
//    var opt = document.createElement('option');
//    opt.innerHTML = select_box_options[i].toProperCase();
//    opt.value = select_box_options[i];
//    sel.appendChild(opt);
//  }
  blockDataByGenre();
  function blockDataByGenre() {
    var params = $('.tabs ul.tabs-nav li.current').attr("id");
    var tmp_arr = [];
    var html_template = '<option value="select_block">Select none</option>';

    for(i in ruby_data) {
      var rdata = ruby_data[i];
      if (rdata.genre == params && tmp_arr.indexOf(rdata.blocks) < 0) {
        //html_template += '<option value="'+rdata.blocks+'">'+rdata.blocks.toProperCase()+'</option>';
        tmp_arr.push(rdata.blocks);
      }
    }

    tmp_arr.sort(alphabetical);

    for(i in tmp_arr) {
      html_template += '<option value="'+tmp_arr[i]+'">'+tmp_arr[i].toProperCase()+'</option>';
    }

    $("#listBlocksChosen").html(html_template);

  }


  $("#listBlocksChosen").change(function (d) {
    var selectBoxArray = $("#listBlocksChosen").val();

    if(selectBoxArray !== null && selectBoxArray !== "select_block") {
      filterBlocks.filter(function (d) {
        return selectBoxArray.indexOf(d) >= 0;
      });
    } else if(selectBoxArray == "select_block") {
      filterBlocks.filterAll();
    }
    dc.redrawAll();
  });

  // Fill Cluster dropdown
  select_box_options = listClustersSorted;
  // Target the select dropdown to be filled with options
  // sel = document.getElementById('listClustersChosen');
  // // For each cluster in the list, create an option
  // for(var i = 0; i < select_box_options.length; ++i) {
  //   var opt = document.createElement('option');
  //   opt.innerHTML = select_box_options[i];
  //   opt.value = select_box_options[i];
  //   sel.appendChild(opt);
  // }
  $("#listClustersChosen").change(function (d) {
    var selectBoxArray1 = $("#listClustersChosen").val();

    if(selectBoxArray1 !== null && selectBoxArray1 !== "select_cluster") {
      filterClusters.filter(function (d) {

        return selectBoxArray1.indexOf(d) >= 0;
      });
    } else if(selectBoxArray1 == "select_cluster") {
      filterClusters.filterAll();
    }
    dc.redrawAll();

  });

  function getQuestionNameByGenre(genre) {
    var counter = 1;
    for(i in all_questions) {
      if (all_questions[i].genre == genre) {
        $("#qt"+counter).html(all_questions[i].name);
        counter++;
      }
    }
  }


  var dates = date.group(d3.time.month).reduceCount(function (d) {
    return d.id;
  });

  d3.json("/districts.json", function (error, map_data) {

    var schoolTypeColor = {
      "Lower Primary": "#5280C2",
      "Model Primary": "#7EB3FF",
      "Upper Primary": "#C6DFE7",
      "Anganwadi": "#5280C2",
      "Akshara Balwadi": "#7EB3FF",
      "Independent  Balwadi": "#C6DFE7"
    }

    var booleanColor = ["#5280C2","#7EB3FF","#C6DFE7","#DDF5FC"];

    var projection = d3.geo.mercator()
    .scale(2600)
    .translate([-3360, 870]);


    // Draw the state map
    var choroplethChartExtent = d3.extent(districtGroup.top(Infinity), function (d) { return d.value; });
    choroplethChart.projection(projection)
    .width(250)
    .height(350)
    .dimension(district)
    .group(districtGroup)
    .colors(d3.scale.quantize().range(["#C6DFE7", "#7EB3FF" ,"#5280C2"]))
    .colorDomain(choroplethChartExtent)
    .colorCalculator(function (d) {
      return d ? choroplethChart.colors()(d) : '#f7f7f7';
    })
    .colorAccessor(function (d, i) {
      return d;
    })
    .overlayGeoJson(map_data.features, "district", function (d) {
      return d.properties.dist_name;
    });


    numResponsesChart.width(responsesChartWidth)
    .height(165)
    .margins({
      top: 15,
      right: 10,
      bottom: 30,
      left: 50
    })
    .dimension(date)
    .gap(1)
    .group(numResponsesGroup)
    //.yAxis().ticks(4)
    .centerBar(true)
    .brushOn(false)
    //.elasticY(true)
    .xUnits(function () {
      return 20;
    })
    .x(d3.time.scale()
      .domain([new Date(2013, 03, 1), new Date()])
      .rangeRound([0, 1060]))
    .xAxis().ticks(d3.time.month, 3);

    // Draw the charts
    schoolTypeChart.width(150)
    .height(120)
    .transitionDuration(500)
    .dimension(types_S)
    .group(schoolGroup)
    .colorCalculator(function (d) {
      return schoolTypeColor[d.key];
    })
    .xAxis()
    .ticks(2);

    schoolType_AChart.width(150)
    .height(150)
    .transitionDuration(500)
    .dimension(types_A)
    .group(pschoolgroup)
    .colorCalculator(function (d) {
      return schoolTypeColor[d.key];
    })
    .xAxis()
    .ticks(2);

    question1Chart.width(150)
    .height(100)
    .transitionDuration(500)
    .dimension(question1)
    .group(q1Group)
    .colorCalculator(function (d) {
      return booleanColor[d.key];
    })
    .label(function (d) {
      if(d.key == '1')
        return 'Yes: '+ d.value;
      else if(d.key == '0')
        return 'No: '+ d.value;
    })
    .title(function(d) {
      if (d.key === 1) {
        return "Yes: " + d.value;
      }else {
        return "No: " + d.value;
      }
    })
    .xAxis()
    .ticks(2);

    question2Chart.width(150)
    .height(100)
    .transitionDuration(500)
    .dimension(question2)
    .group(q2Group)
    .colorCalculator(function (d) {
      return booleanColor[d.key];
    })
    .label(function (d) {
      if(d.key == '1')
        return 'Yes: '+ d.value;
      else if(d.key == '0')
        return 'No: '+ d.value;
    })
    .title(function(d) {
      if (d.key === 1) {
        return "Yes: " + d.value;
      }else {
        return "No: " + d.value;
      }
    })
    .elasticX(true)
    .xAxis()
    .ticks(2);

    question3Chart.width(150)
    .height(100)
    .transitionDuration(500)
    .dimension(question3)
    .group(q3Group)
    .colorCalculator(function (d) {
      return booleanColor[d.key];
    })
    .label(function (d) {
      if(d.key == '1')
        return 'Yes: '+ d.value;
      else if(d.key == '0')
        return 'No: '+ d.value;
    })
    .title(function(d) {
      if (d.key === 1) {
        return "Yes: " + d.value;
      }else {
        return "No: " + d.value;
      }
    })
    .elasticX(true)
    .xAxis()
    .ticks(2);

    question4Chart.width(150)
    .height(100)
    .transitionDuration(500)
    .dimension(question4)
    .group(q4Group)
    .colorCalculator(function (d) {
      return booleanColor[d.key];
    })
    .label(function (d) {
      if(d.key == '1')
        return 'Yes: '+ d.value;
      else if(d.key == '0')
        return 'No: '+ d.value;
    })
    .title(function(d) {
      if (d.key === 1) {
        return "Yes: " + d.value;
      }else {
        return "No: " + d.value;
      }
    })
    .elasticX(true)
    .xAxis()
    .ticks(2);

    question5Chart.width(180)
    .height(130)
    .dimension(question5)
    .group(q5Group)
    .colorCalculator(function (d, i) {
      return booleanColor[i];
    })
    .label(function (d) {
      return d.key + ": " + d.value;
    })
    .title(function(d) {
      return d.key + ": " + d.value;
    })
    .elasticX(true)
    .xAxis().ticks(2);


    question5sChart.width(150)
    .height(100)
    .transitionDuration(500)
    .dimension(question5s)
    .group(q5sGroup)
    .colorCalculator(function (d) {
      return booleanColor[d.key];
    })
    .label(function (d) {
      if(d.key == '1')
        return 'Yes: '+ d.value;
      else if(d.key == '0')
        return 'No: '+ d.value;
    })
    .title(function(d) {
      if (d.key === 1) {
        return "Yes: " + d.value;
      }else {
        return "No: " + d.value;
      }
    })
    .elasticX(true)
    .xAxis().ticks(2);

    question6Chart.width(150)
    .height(150)
    .transitionDuration(500)
    .dimension(question6)
    .group(q6Group)
    .colorCalculator(function (d) {
      if(d.key) {
        return booleanColor[d.key];
      } else {
        return booleanColor[0];
      }
    })
    .label(function (d) {
      if(d.key == '1')
        return 'A: '+ d.value;
      else if(d.key == '2')
        return 'B: '+ d.value;
      else if(d.key == '3')
        return 'C: '+ d.value;
      return 'null: ' + d.value;
    })
    .title(function(d) {
      if(d.key == '1')
        return 'A: ' + d.value;
      else if(d.key == '2')
        return 'B: ' + d.value;
      else if(d.key == '3')
        return 'C: ' + d.value;
      return 'null: ' + d.value;
    })
    .elasticX(true)
    .xAxis()
    .ticks(2);

    var counter = 0;
    dataTable.dimension(date).group(function (d) {
      return "";
    })
    .size(40) // number of rows
    .columns([

      function (d) {
        var dd = d.date.getDate();
        var mm = d.date.getMonth() + 1;
        var yyyy = d.date.getFullYear();
        if(dd < 10)
          dd = '0' + dd;
        if(mm < 10)
          mm = '0' + mm;
        var form_date = dd + '/' + mm + '/' + yyyy;
        return form_date;
      },
      function (d) {
        return d.blocks.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      },
      function (d) {
        return d.clusters.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      },
      function (d) {
        return d.school_name.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      },
      function (d) {
        if (d.question1 > 0) {
          return "Y";
        }else {
          return "N";
        }
      },
      function (d) {
        if (d.question2 > 0) {
          return "Y";
        }else {
          return "N";
        }
      },
      function (d) {
        if (d.question3 > 0) {
          return "Y";
        }else {
          return "N";
        }

      },
      function (d) {
        if (d.question4 > 0) {
          return "Y";
        }else {
          return "N";
        }

      },
      function (d) {
        var tt = $('.tabs ul.tabs-nav li.current').attr("id");
        if (tt !== "pre-school") {
          if (d.question5 > 0) {
            return "Y";
          }else {
            return "N";
          }
        }else {
          return d.question5;
        }


      },
      function (d) {
        return d.question6;
      }
      ])
    .sortBy(function (d) {
      return d.date;
    })
    .order(d3.descending);
    // .sortValues(function(a,b) {
    //   return a.q2 - b.q2
    // });

    dc.renderAll();
    $("#question5").hide();
    $("#type_A").hide();

    d3.selectAll("#map .district path").attr("data-state",function(d) {
      return d.properties.DISTSHP.toLowerCase();
    });

    for(var i = 1; i <= 6; i++) {
      d3.select("#question"+i+" g").attr("transform","translate(10,0)")
    }

    d3.select("#type_A g").attr("transform","translate(10,-20)")

    var schools_type_list = ["Lower Primary", "Model Primary", "Upper Primary"];
    d3.selectAll(".dc-legend-item")
    .style("visibility",function(d) {
      if (schools_type_list.indexOf(d.name) < 0 ) {
        return "hidden";
      }else {
        return "visibile";
      }
    });

  function blockDataByState(genre,state) {

    var tmp_arr = new Array();
    var html_template = '<option value="select_block">Select none</option>';

    for(i in ruby_data) {
      var rdata = ruby_data[i];
      if (rdata.genre == genre && tmp_arr.indexOf(rdata.blocks) < 0 && rdata.district.toLowerCase() === state) {
        tmp_arr.push(rdata.blocks);
      }
    }

    for(i in tmp_arr) {
      html_template += '<option value="'+tmp_arr[i]+'">'+tmp_arr[i].toProperCase()+'</option>';
    }

    $("#listBlocksChosen").html(html_template);

  }


  $(document).on('click', '#map path', function (e) {

    if ($(this).attr("class") == "iselected") {
      blockDataByGenre();
      dc.filterAll();
      dc.redrawAll();
      $(this).attr("class","sselected");

    }else {
      choroplethChart.filter(null);
      $(this).attr("class","iselected");

      var state = $(this).attr("data-state");
      var genre = $('.tabs ul.tabs-nav li.current').attr("id");
      blockDataByState(genre,state);

    }


  });


  });

  $("<a id='reset-all' href='javascript:dc.filterAll();dc.redrawAll();' style='margin-top:0px;'>Reset all</a>").appendTo("#reset-link");

  $("#reset-all").click(function() {
    $('#listBlocksChosen option:first-child').attr("selected", "selected");
    $('#listClustersChosen option:first-child').attr("selected", "selected");
    $('#listBlocksChosen').trigger("change");
    $('#listClustersChosen').trigger("change");
  });

}

function alphabetical(a, b){
  var A = a.toLowerCase();
  var B = b.toLowerCase();
  if (A < B){
    return -1;
  }else if (A > B){
    return  1;
  }else{
    return 0;
  }
}
