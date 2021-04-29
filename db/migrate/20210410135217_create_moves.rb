class CreateMoves < ActiveRecord::Migration[6.1]
  def change
    create_table :moves do |t|
      t.integer :score
      t.string :placed_letters
      t.references :player, null: false, foreign_key: true
      t.boolean :provisional

      t.timestamps
    end
  end
end
