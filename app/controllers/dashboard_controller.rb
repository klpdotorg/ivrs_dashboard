class DashboardController < ApplicationController

  def index
    allschool = Response.includes(:school)
    @dashboard = Response.makeDataInChartFormat(allschool)
    @questions = Question.all    

    last_updated = Time.parse(File.open("public/last-update.txt", "r").read)
    @last_updated = last_updated.strftime("%a, %d %b %Y %H:%M:%S") +" " + last_updated.zone

    pre_yest = Response.yesterday_count("schools.genre =  'Anganwadi'").count
    sch_yest = Response.yesterday_count("schools.genre != 'Anganwadi'").count

    pre_count = Response.all_count("schools.genre =  'Anganwadi'").count
    sch_count = Response.all_count("schools.genre != 'Anganwadi'").count

    @stat_value = {"pre_yest" => pre_yest, "sch_yest" => sch_yest, "pre_count" => pre_count,
                   "sch_count"=> sch_count}

  end

end
