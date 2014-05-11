class DashboardController < ApplicationController

  def index
    allschool = Response.includes(:school)
    @dashboard = Response.makeDataInChartFormat(allschool)
  end

end
