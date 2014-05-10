class DashboardController < ApplicationController
  
  def index    
    pre_schools_yesterday = Response.yesterday_count("schools.genre = 'Anganwadi'").count
    schools_yesterday = Response.yesterday_count("schools.genre != 'Anganwadi'").count

    pre_schools_week = Response.week_count("schools.genre = 'Anganwadi'").count
    schools_week = Response.week_count("schools.genre != 'Anganwadi'").count    
    
    pre_school = Response.includes(:school).where("schools.genre = 'Anganwadi'")
    schools = Response.includes(:school).where("schools.genre != 'Anganwadi'")

    pre_school = Response.makeDataInChartFormat(pre_school,"preschool")
    schools = Response.makeDataInChartFormat(schools,"school")

    @dashboard = {pre_schools_yesterday: pre_schools_yesterday, schools_yesterday: schools_yesterday, pre_schools_week: pre_schools_week, schools_week: pre_schools_week, pre_school: pre_school, schools: schools}  
    
  end

end
