class CreateResponses < ActiveRecord::Migration
  def change
    create_table :responses do |t|
      t.string :mobile_no
      t.integer :school_id
      t.datetime :date
      t.integer :a1
      t.integer :a2
      t.integer :a3
      t.integer :a4
      t.integer :a5
      t.integer :a6

      t.timestamps
    end
  end
end
