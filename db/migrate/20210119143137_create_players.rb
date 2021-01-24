class CreatePlayers < ActiveRecord::Migration[6.1]
  def change
    create_table :players do |t|
      t.references :user, null: false, foreign_key: true
      t.references :game, null: false, foreign_key: true
      t.integer :player_score, default: 0
      t.string :player_letters, default: ""

      t.timestamps
    end
  end
end
