class AddJokersToGame < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :jokers, :integer, array:true, default:[]
  end
end
