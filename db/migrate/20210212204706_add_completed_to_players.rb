class AddCompletedToPlayers < ActiveRecord::Migration[6.1]
  def change
    add_column :players, :completed, :boolean, default: false
  end
end
