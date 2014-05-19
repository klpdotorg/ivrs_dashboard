class DashboardController < ApplicationController

  def index
    allschool = Response.includes(:school)
    @dashboard = Response.makeDataInChartFormat(allschool)
    @questions = Question.all
  end

end
