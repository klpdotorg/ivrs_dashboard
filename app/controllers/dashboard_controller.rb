class DashboardController < ApplicationController

  def index
    allschools = Response.joins(:school).select("responses.*, schools.*")
    hash_data  = Response.makeDataInChartFormat(allschools)
    @dashboard = hash_data[:dashboard]
    @questions = Question.all        
    @last_updated = hash_data[:last_call].strftime("%a, %d %b %Y %H:%M:%S") +" " + hash_data[:last_call].zone
    @stat_value = {"pre_yest" => hash_data[:yps_count], "sch_yest" => hash_data[:yss_count], "pre_count" => hash_data[:ps_count],"sch_count"=> hash_data[:ss_count]}
    sssss
  end

end
