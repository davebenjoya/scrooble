class RemovePlayersFromGame < ActiveRecord::Migration[6.1]
  def change
    remove_column :games, :players
  end
end
