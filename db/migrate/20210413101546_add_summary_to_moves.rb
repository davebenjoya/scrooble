class AddSummaryToMoves < ActiveRecord::Migration[6.1]
  def change
    add_column :moves, :summary, :string
  end
end
