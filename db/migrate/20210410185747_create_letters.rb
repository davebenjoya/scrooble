class CreateLetters < ActiveRecord::Migration[6.1]
  def change
    create_table :letters do |t|
      t.string :character
      t.integer :position
      t.references :move, null: false, foreign_key: true

      t.timestamps
    end
  end
end
