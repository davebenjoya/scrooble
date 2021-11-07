class AddJokerArrayToMoves < ActiveRecord::Migration[6.1]
  def change
    add_column :moves, :joker_array, :integer, array: true, default: []
  end
end
