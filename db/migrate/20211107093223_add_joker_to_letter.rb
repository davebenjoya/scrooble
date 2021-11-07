class AddJokerToLetter < ActiveRecord::Migration[6.1]
  def change
    add_column :letters, :joker, :boolean, default: false
  end
end
