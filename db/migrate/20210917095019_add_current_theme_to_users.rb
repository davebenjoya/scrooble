class AddCurrentThemeToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :current_theme, :string, :default => "underwater"
  end
end
