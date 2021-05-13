class CreateWordsTable < ActiveRecord::Migration[6.1]
  def change
    create_table :words_tables do |t|
      t.string :word
      t.integer :score
      t.references :move, null: false, foreign_key: true

      t.timestamps
    end
  end
end
