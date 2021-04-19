class RemovePlacedLettersFromMoves < ActiveRecord::Migration[6.1]
  def change
    remove_column :moves, :placed_letters
  end
end
