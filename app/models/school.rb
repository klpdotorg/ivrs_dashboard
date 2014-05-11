class School < ActiveRecord::Base
  self.primary_key = 'code'
  attr_accessible :block, :cluster, :code, :district, :name, :genre

  has_many :responses
  before_save :trim_strings

  def self.seed
    School.delete_all
    csv_text = File.read('public/schools2.csv')
    csv = CSV.parse(csv_text, :headers => true)
    csv.each do |row|
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
