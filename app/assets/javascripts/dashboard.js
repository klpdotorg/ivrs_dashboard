$(document).ready(function () {
  $('.tabs ul.tabs-nav li').click(function () {
    var tab_id = $(this).attr('data-tab');
    $('.tabs ul.tabs-nav li').removeClass('current');
    $('.tabs .tabs-content').removeClass('current');
    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  });
});

function dashboardChartInit(data) {
  var numResponsesChart = dc.barChart("#bar-chart");
  var responsesChartWidth = $("#bar-chart").width();
  var choroplethChart = dc.geoChoroplethChart("#map");
  var schoolTypeChart = dc.pieChart("#type");
  var question1Chart = dc.pieChart("#question1");
  var question2Chart = dc.pieChart("#question2");
  var question3Chart = dc.pieChart("#question3");
  var question4Chart = dc.pieChart("#question4");
  var question5Chart = dc.pieChart("#question5");
  var question6Chart = dc.pieChart("#question6");
  var dataTable = dc.dataTable("#response-list");



    // Let's have a date object for each record from the individual date fields
    data.forEach(function (d, i) {
      d.date = new Date(d.years, d.months - 1, d.dates);
    });

    // Get the number of responses for yesterday
    var num_response_yest = 0;
    data.forEach(function(d) {
      var yest_date = new Date();
      yest_date.setDate(yest_date.getDate() - 1);
      if(d.date.toString() == yest_date.toString())
      {
        ++num_response_yest;
      }
    });
    $("#num_response_yest_n").html(num_response_yest);

    // Get the number of responses for the last week
    var num_response_this_week = 0;
    data.forEach(function(d) {
      var today_date = new Date();
      var last_week_date = new Date();
      last_week_date.setDate(last_week_date.getDate() - 7);

      if(d.date >= last_week_date && d.date <= today_date)
        ++num_response_this_week;
    });
    $("#num_response_this_week_n").html(num_response_this_week);

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
      types = questionaire.dimension(function (d) {
        return d.types;
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
        if(d.question1) return d.question1;
      }),
      question2 = questionaire.dimension(function (d) {
        if(d.question2) return d.question2;
      }),
      question3 = questionaire.dimension(function (d) {
        if(d.question3) return d.question3;
      }),
      question4 = questionaire.dimension(function (d) {
        if(d.question4) return d.question4;
      }),
      question6 = questionaire.dimension(function (d) {
        if(d.question6) return d.question6;
      });
      var q5 = questionaire.dimension(function (d) {
        if(d.question5) return d.question5;
      });
      var extentq5 = d3.extent(q5.top(Infinity), function (d) {
        return d.question5;
      });
      var partitionq5 = 4;
      var question5 = questionaire.dimension(function (d) {
        if (d.question5) {
          var quarter = (extentq5[1] - extentq5[0]) / partitionq5;
          for (var i=1;i<=partitionq5;i++) {
            if (d.question5>= (extentq5[0]+(quarter*i))-quarter && d.question5<(extentq5[0]+quarter*i)) {
              d.range = parseInt((extentq5[0]+(quarter*i))-quarter) + "-" + parseInt(extentq5[0]+quarter*i);
              return d.range;
            }
          }
        }
      });

    // Get the count of facts
    schoolGroup = types.group();
    numResponsesGroup = date.group(d3.time.month),
    q1Group = question1.group();
    q2Group = question2.group();
    q3Group = question3.group();
    q4Group = question4.group();
    q5Group = question5.group();
    q6Group = question6.group();
    districtGroup = district.group();
    genreGroup = district.group();

    var blockGroup = blocks.group();
    var clusterGroup = clusters.group();

    // Show onlly pre-school data initially
    genre.filter("preschool");

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

    // Fill Block dropdown
    // Get sorted values
    var select_box_options = listBlocksSorted;
    // Target the select dropdown to be filled with options
    var sel = document.getElementById('listBlocksChosen');
    // For each block in the list, create an option
    for(var i = 0; i < select_box_options.length; ++i) {
      var opt = document.createElement('option');
      opt.innerHTML = select_box_options[i];
      opt.value = select_box_options[i];
      sel.appendChild(opt);
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
    sel = document.getElementById('listClustersChosen');
    // For each cluster in the list, create an option
    for(var i = 0; i < select_box_options.length; ++i) {
      var opt = document.createElement('option');
      opt.innerHTML = select_box_options[i];
      opt.value = select_box_options[i];
      sel.appendChild(opt);
    }
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

    // Show only pre-school data
    $("#pre-school").click(function () {
      genre.filterAll();
      genre.filter("preschool");
      dc.redrawAll();
    });

    // Show only school data
    $("#school").click(function () {
      genre.filterAll();
      genre.filter("school");
      dc.redrawAll();
    });

    var dates = date.group(d3.time.month).reduceCount(function (d) {
      return d.id;
    });

    d3.json("/rahul/districts.json", function (error, map_data) {

      var projection = d3.geo.mercator()
        .scale(2600)
        .translate([-3360, 870]);

      // Draw the state map
      choroplethChart.projection(projection)
        .width(250)
        .height(350)
        .dimension(district)
        .group(districtGroup)
        .colors(d3.scale.quantize().range(["#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
        .colorDomain([0, 2000])
        .colorCalculator(function (d) {
          return d ? choroplethChart.colors()(d) : '#f7f7f7';
        })
        .colorAccessor(function (d, i) {
          return d;
        })
        .overlayGeoJson(map_data.features, "district", function (d) {
          //console.log(d);
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
        .height(150)
        .transitionDuration(500)
        .dimension(types)
        .group(schoolGroup)
        .radius(70)
        .minAngleForLabel(0)
        .label(function (d) {
          //console.log(d);
          return d.key;
        });
      question1Chart.width(150)
        .height(150)
        .transitionDuration(500)
        .dimension(question1)
        .group(q1Group)
        .radius(70)
        .minAngleForLabel(0)
        .label(function (d) {
          if(d.key == '1')
            return 'Y';
          else if(d.key == '0')
            return 'N';
        });
      question2Chart.width(150)
        .height(150)
        .transitionDuration(500)
        .dimension(question2)
        .group(q2Group)
        .radius(70)
        .minAngleForLabel(0)
        .label(function (d) {
          if(d.key == '1')
            return 'Y';
          else if(d.key == '0')
            return 'N';
        });
      question3Chart.width(150)
        .height(150)
        .transitionDuration(500)
        .dimension(question3)
        .group(q3Group)
        .radius(70)
        .minAngleForLabel(0)
        .label(function (d) {
          if(d.key == '1')
            return 'Y';
          else if(d.key == '0')
            return 'N';
        });
      question4Chart.width(150)
        .height(150)
        .transitionDuration(500)
        .dimension(question4)
        .group(q4Group)
        .radius(70)
        .minAngleForLabel(0)
        .label(function (d) {
          if(d.key == '1')
            return 'Y';
          else if(d.key == '0')
            return 'N';
        });
      question5Chart.width(150)
        .height(150)
        .transitionDuration(500)
        .dimension(question5)
        .group(q5Group)
        .radius(70)
        .minAngleForLabel(0)
        .label(function (d) {
          console.log(d);
          d.key;
        });
      question6Chart.width(150)
        .height(150)
        .transitionDuration(500)
        .dimension(question6)
        .group(q6Group)
        .radius(70)
        .minAngleForLabel(0)
        .label(function (d) {
          if(d.key == '1')
            return 'A';
          else if(d.key == '2')
            return 'B';
          else if(d.key == '3')
            return 'C';
        });

      dataTable.dimension(date)
        .group(function (d) {
          return ""
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
          return d.question1;
        },
        function (d) {
          return d.question2;
        },
        function (d) {
          return d.question3;
        },
        function (d) {
          return d.question4;
        },
        function (d) {
          return d.question5;
        },
        function (d) {
          return d.question6;
        }
      ])
        .sortBy(function (d) {
          return d.date;
        })
        .order(d3.ascending);

      dc.renderAll();

    });

}