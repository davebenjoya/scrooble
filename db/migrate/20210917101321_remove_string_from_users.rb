class RemoveStringFromUsers < ActiveRecord::Migration[6.1]
  def up
    remove_column :users, :string
  end
  def down
    remove_column :users, :string
  end
end
