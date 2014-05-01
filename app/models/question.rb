class Question < ActiveRecord::Base
  attr_accessible :answer, :genre, :name

  def self.seed
    Question.delete_all
    genre = 'Preschools'
    questions = Hash[1 => ["Was the center open?",
                           "Was anganwadi worker present in the centre",
                           "Was the worker conducting activities for the children?",
                           "Was the teaching and learning materials placed at eye level for the children?",
                           "Approximately how many children were there?",
                           "Is this a A, B or C grade anganwadi based on your observations?"
                          ],
                     2 => ["Was the school open?",
                           "Was the headmaster present?",
                           "Were all the teachers present?",
                           "Were the toilets for children in good condition",
                           "Were classes being conducted properly?",
                           "Is this a A, B or C grade school based on your observations?"
                          ]
                    ]

    for i in 1..2
      for q in 0..5
        Question.create(genre: genre, name: questions[i][q])
      end
      genre = 'Schools'
    end

  end
end
