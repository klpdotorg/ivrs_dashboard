class Response < ActiveRecord::Base
  attr_accessible :a1, :a2, :a3, :a4, :a5, :a6, :date, :mobile_no, :school_id

  belongs_to :school
  
  before_save :trim_strings

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
