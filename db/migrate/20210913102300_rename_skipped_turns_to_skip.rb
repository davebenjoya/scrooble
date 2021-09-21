class RenameSkippedTurnsToSkip < ActiveRecord::Migration[6.1]
  def change
    rename_column :players, :skipped_turns, :skip
  end
end
