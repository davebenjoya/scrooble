class AddCurrentPlayerToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :current_player, :integer, null: false, default: 0
  end
end
