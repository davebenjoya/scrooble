class ChangeJokersTointegerArray < ActiveRecord::Migration[6.0]
  def change
    change_column :games, :jokers, :integer, array: true, default: [], using: 'ARRAY[jokers]::INTEGER[]'
  end
end
