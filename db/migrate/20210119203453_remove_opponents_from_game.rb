class RemoveOpponentsFromGame < ActiveRecord::Migration[6.1]
  def change
    remove_column :games, :opponents
  end
end
