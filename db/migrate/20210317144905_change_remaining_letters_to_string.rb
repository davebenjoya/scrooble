class ChangeRemainingLettersToString < ActiveRecord::Migration[6.1]
  def change
    change_column_default :games, :remaining_letters, from: "{}", to: ""
  end
end
