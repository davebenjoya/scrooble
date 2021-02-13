class ChangeRemainingLettersToStringInGames < ActiveRecord::Migration[6.1]
  def change
    change_column :games, :remaining_letters, :string, array: false
  end
end
