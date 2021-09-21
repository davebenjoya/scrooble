class AddCurrentThemeToUsers < ActiveRecord::Migration[6.1]
  def change
    rename_column :users, :string, :current_theme, :default => 'underwater'
  end
end
