class ChangeChallengingToStringOnPlayer < ActiveRecord::Migration[6.1]
  def change
    change_column :players, :challenging, :string, :default => "pending"
  end
end
