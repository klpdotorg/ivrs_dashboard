class Response < ActiveRecord::Base
  attr_accessible :a1, :a2, :a3, :a4, :a5, :a6, :date, :mobile_no, :school_id

  belongs_to :school
  before_save :trim_strings

  #SCOPES
  scope :yesterday_count, -> genre { includes(:school).where("#{genre} AND responses.date = '#{Date.today - 1}'")}
  scope :all_count, -> genre { includes(:school).where("#{genre}")}

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

  def self.makeDataInChartFormat(responses)
    values = []
    responses.each do |response|
      type = 'school'
      if response.school.genre == "Anganwadi"
        type = "preschool"
      end
      values << { id: response.id, district: response.school.district.upcase,
                  blocks: response.school.block, clusters: response.school.cluster,
                  genre: type, school_name: response.school.name,
                  mobile_no: response.mobile_no, dates: response.date.day,
                  months: response.date.month, years: response.date.year, types: response.school.genre,
                  question1: response.a1, question2: response.a2, question3: response.a3,
                  question4: response.a4, question5: response.a5, question6: response.a6
                }

    end
    values = Response.getQuaterValues(values)
  end

  def self.getQuaterValues(data)
    max = 0
    min = 1
    paq = 4
    tmp = []
    
    data.each do |d|
      unless d[:question5].nil?
        if d[:question5] > max
          max = d[:question5]
        end
      end
    end
    
    data.each do |d|
      d[:range] = nil
      unless d[:question5].nil?
        quarter = ((max - min) / paq)        
        for v in 1..max
          if d[:question5] >= ((min+(quarter*v))-quarter) and d[:question5] < (max+quarter)*v
            d[:range] = ((min+(quarter*v))-quarter).to_s + "-" + ((min+quarter)*v).to_s
          end
        end

      end
      tmp << d
    end
    tmp
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

  def self.getYesterdayData
    fr_dt = (Date.today - 1).strftime("%m/%d/%Y")
    to_dt = fr_dt
    iopen = open("http://202.83.16.183:85/akshara/json_feeds.php?fromdate=#{fr_dt}&enddate=#{to_dt}").read
    
    unless iopen == "null"
      results = JSON.parse(iopen)
      results.each do |result|
        Response.create(mobile_no: result['Mobile Number'], school_id: result['School ID'],
        date: result['Date & Time'], a1: result['1'], a2: result['2'], a3: result['3'],
        a4: result['4'], a5: result['5'], a6: result['6'])
      end      
    end

    File.open("public/last-update.txt", File::CREAT | File::RDWR) do |file|
      file.write(Time.now)
      file.close
    end

  end

end
