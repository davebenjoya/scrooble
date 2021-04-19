class RemoveScoreFromMoves < ActiveRecord::Migration[6.1]
  def change
    remove_column :moves, :score
  end
end
