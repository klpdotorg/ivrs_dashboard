class Response < ActiveRecord::Base
  attr_accessible :a1, :a2, :a3, :a4, :a5, :a6, :date, :mobile_no, :school_id

  belongs_to :school  
  before_save :trim_strings

  #SCOPES
  scope :yesterday_count, -> genre { includes(:school).where("#{genre} AND responses.date = '#{Date.today - 1}'")} 
  scope :week_count, -> genre { includes(:school).where("#{genre} AND responses.date BETWEEN '#{Date.today - 7}' AND '#{Date.today}'")}   


  def self.hashToCSV(responses)        
    column_names = ['id', 'district', 'blocks', 'clusters', 'genre', 'types', 'school_name',
                    'mobile_no', 'dates', 'months', 'years', 'question1', 'question2',
                    'question3', 'question4', 'question5', 'question6']

    icsv =  CSV.generate do |csv|
              csv << column_names
              responses.each do |response|                
                csv << [response.id, response.school.district, response.school.block,
                        response.school.cluster, response.school.genre, response.school.name,
                        response.mobile_no, response.date.day, response.date.month,
                        response.date.year, response.a1, response.a2, response.a2, response.a3,
                        response.a4, response.a5, response.a6 ]
              end
            end
    CSV.parse(icsv)
  end

  def self.seed  
    Response.delete_all  
    csv_text = File.read('public/response.csv')
    csv = CSV.parse(csv_text, :headers => true)    
    csv.each do |row|
      Response.create!(row.to_hash)
    end    
  end

  def trim_strings
    self.mobile_no = self.mobile_no.strip
  end

end
