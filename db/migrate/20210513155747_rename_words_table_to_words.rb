class RenameWordsTableToWords < ActiveRecord::Migration[6.1]
  def change
    rename_table :words_tables, :words
  end
end
