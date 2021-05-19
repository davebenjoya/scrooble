class RenameColumnWordToCharactersOnWords < ActiveRecord::Migration[6.1]
  def change
    rename_column :words, :word, :characters
  end
end
