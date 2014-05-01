class School < ActiveRecord::Base
  
  attr_accessible :block, :cluster, :code, :district, :name, :genre

  before_save :trim_strings

  def self.seed  
    School.delete_all  
    csv_text = File.read('public/schools.csv')
    csv = CSV.parse(csv_text, :headers => true)    
    csv.each do |row|
      puts row.to_hash
      School.create!(row.to_hash)
    end    
  end

  def trim_strings
    self.name     = self.name.strip
    self.block    = self.block.strip
    self.cluster  = self.cluster.strip
    self.district = self.district.strip
    self.genre    = self.genre.strip
  end

end
