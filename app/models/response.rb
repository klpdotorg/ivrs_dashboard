class Response < ActiveRecord::Base
  attr_accessible :a1, :a2, :a3, :a4, :a5, :a6, :date, :mobile_no, :school_id

  belongs_to :school, :foreign_key => :school_id, :primary_key => :code
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
    schools_count = 0
    pre_schools_count = 0
    y_schools_count = 0
    y_pre_schools_count = 0
    last_call_date = responses.maximum("date")

    responses.each do |response|
            
      if response.genre == "Anganwadi" || response.genre == "Akshara Balwadi" || response.genre == "Independent  Balwadi"
        type = "preschool"
        pre_schools_count += 1

        if response.date.strftime("%Y-%m-%d") == (Date.today - 1).strftime("%Y-%m-%d") 
          y_pre_schools_count += 1
        end
      else
        type = 'school'
        schools_count += 1  
        if response.date.strftime("%Y-%m-%d") == (Date.today - 1).strftime("%Y-%m-%d") 
          y_schools_count += 1
        end

      end
      counter = 0
      unless response.a1.nil?
        counter += response.a1  
      end

      unless response.a2.nil?
        counter += response.a2
      end

      unless response.a3.nil?
        counter += response.a3
      end

      unless response.a4.nil?
        counter += response.a4
      end

      unless response.a5.nil?
        if response.a5 > 0 
          counter += 1
        end
      end
      
      unless response.a6.nil?
        if response.a6 > 0 
          counter += 1
        end
      end

      if counter > 3 # this for complete responses

        values << { id: response.id, district: response.district.upcase,
                    blocks: response.block, clusters: response.cluster,
                    genre: type, school_name: response.name,
                    mobile_no: response.mobile_no, dates: response.date.day,
                    months: response.date.month, years: response.date.year, types: response.genre,
                    question1: response.a1, question2: response.a2, question3: response.a3,
                    question4: response.a4, question5: response.a5, question6: response.a6
                  }
      end
    end
    values = Response.getQuaterValues(values)
    values = {dashboard: values, ps_count: pre_schools_count, ss_count: schools_count, yps_count: y_pre_schools_count, yss_count: y_schools_count, last_call: last_call_date}
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
        # quarter = ((max - min) / paq)        
        # for v in 1..max
        #   if d[:question5] >= ((min+(quarter*v))-quarter) and d[:question5] < (max+quarter)*v
        #     d[:range] = ((min+(quarter*v))-quarter).to_s + "-" + ((min+quarter)*v).to_s
        #   end
        # end
        
          if d[:question5] <= 30
            d[:range] = "1-30"
          elsif d[:question5] >= 31 and d[:question5] <= 60
            d[:range] = "31-60"
          elsif d[:question5] >= 61 
            d[:range] = "61+"
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
    iopen = open("http://89.145.83.72/akshara/json_feeds.php?fromdate=#{fr_dt}&enddate=#{to_dt}").read
    results = JSON.parse(iopen)
    if results.count > 0      
      results.each do |result|
        Response.create!(mobile_no: result['Mobile Number'], school_id: result['School ID'],
        date: result['Date & Time'], a1: result['1'], a2: result['2'], a3: result['3'],
        a4: result['4'], a5: result['5'], a6: result['6'])
      end      
    end

    File.open("public/last-update.txt", File::CREAT | File::RDWR) do |file|
      file.write(Time.now)
      file.close
    end
    results
  end

end
