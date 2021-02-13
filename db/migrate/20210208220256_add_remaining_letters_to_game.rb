class AddRemainingLettersToGame < ActiveRecord::Migration[6.1]
  def change
    add_column :games, :remaining_letters, :string, array: true, default: []
  end
end
