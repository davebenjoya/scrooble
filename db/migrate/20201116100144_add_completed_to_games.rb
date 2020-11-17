class AddCompletedToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :completed, :boolean
  end
end
