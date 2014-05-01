class CreateSchools < ActiveRecord::Migration
  def change
    create_table :schools do |t|
      t.integer :code
      t.string :name
      t.string :type
      t.string :block
      t.string :cluster
      t.string :district

      t.timestamps
    end
  end
end
