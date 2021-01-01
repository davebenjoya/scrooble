class ChangeOpponentsToStringOnGame < ActiveRecord::Migration[6.0]
  def change
    change_column :games, :opponents, :string, array: false
  end
end
