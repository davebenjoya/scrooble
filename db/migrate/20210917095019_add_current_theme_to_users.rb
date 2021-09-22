class AddCurrentThemeToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :string
  end
end
