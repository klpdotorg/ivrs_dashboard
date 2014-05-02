class DashboardController < ApplicationController
  
  def index
    @all_schools = School.joins(:responses)    
    @questions = Question.all
    @pre_schools = @all_schools.where(genre: "Anganwadi")
    @schools = @all_schools.where("genre != 'Anganwadi'")
  end

end
