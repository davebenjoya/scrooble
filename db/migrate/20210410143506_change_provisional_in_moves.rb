class ChangeProvisionalInMoves < ActiveRecord::Migration[6.1]
  def change
    change_column_default(:moves, :provisional, true)
  end
end
