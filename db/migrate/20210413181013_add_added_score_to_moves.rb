class AddAddedScoreToMoves < ActiveRecord::Migration[6.1]
  def change
    add_column :moves, :added_score, :integer, default: 0
  end
end
