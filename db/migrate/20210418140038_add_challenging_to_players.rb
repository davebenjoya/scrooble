class AddChallengingToPlayers < ActiveRecord::Migration[6.1]
  def change
    add_column :players, :challenging, :boolean, default: true
  end
end
