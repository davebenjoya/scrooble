class AddPositionArrayToMoves < ActiveRecord::Migration[6.1]
  def change
    add_column :moves, :position_array, :integer, array: true, default: []
  end
end
