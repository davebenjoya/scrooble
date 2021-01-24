class ChangeJokersToString < ActiveRecord::Migration[6.0]
  def change
    change_column :games, :jokers, :string, array: false
  end
end
