class AddOpponentsToGame < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :opponents, :text, array: true
  end
end
