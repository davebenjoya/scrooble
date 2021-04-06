class MakeUsermaeNotNullAgain < ActiveRecord::Migration[6.1]
  def change

    change_column :users, :username, :string, null: false
  end
end
