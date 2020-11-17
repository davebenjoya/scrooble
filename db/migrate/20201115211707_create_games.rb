class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.string :letter_grid
      t.string :players

      t.timestamps
    end
  end
end
