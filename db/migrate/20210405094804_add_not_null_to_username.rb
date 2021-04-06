class AddNotNullToUsername < ActiveRecord::Migration[6.1]
  def change

    change_column :users, :username, :string, null: false
  end
end
