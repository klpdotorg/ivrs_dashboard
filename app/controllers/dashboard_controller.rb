class DashboardController < ApplicationController
  
  def index    
    pre_schools_yesterday = Response.yesterday_count("schools.genre = 'Anganwadi'").count
    schools_yesterday = Response.yesterday_count("schools.genre != 'Anganwadi'").count

    pre_schools_week = Response.week_count("schools.genre = 'Anganwadi'").count
    schools_week = Response.week_count("schools.genre != 'Anganwadi'").count

    @dashboard_values = {pre_schools_yesterday: pre_schools_yesterday, schools_yesterday: schools_yesterday, pre_schools_week: pre_schools_week, schools_week: pre_schools_week}  
    
    responses = Response.includes(:school)
    output = Response.hashToCSV(responses)
    

  end

end
