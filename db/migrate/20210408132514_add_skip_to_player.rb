class AddSkipToPlayer < ActiveRecord::Migration[6.1]
  def change
    add_column :players, :skip, :boolean, default: false
  end
end
