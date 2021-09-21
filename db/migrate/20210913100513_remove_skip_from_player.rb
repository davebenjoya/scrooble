class RemoveSkipFromPlayer < ActiveRecord::Migration[6.1]
  def up
    remove_column :players, :skip
  end
  def down
    remove_column :players, :skip
  end
end
