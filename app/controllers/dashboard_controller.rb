class DashboardController < ApplicationController

  def index
    allschool = Response.includes(:school)
    @dashboard = Response.makeDataInChartFormat(allschool)
    @questions = Question.all

    last_updated = Time.parse(File.open("public/last-update.txt", "r").read)
    @last_updated = last_updated.strftime("%a, %d %b %Y %H:%M:%S") +" " + last_updated.zone

  end

end
